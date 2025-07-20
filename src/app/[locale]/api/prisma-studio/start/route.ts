import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"

const PID_FILE = join(process.cwd(), ".prisma-studio.pid")
const PORT = 5555

export async function POST(request: NextRequest) {
  try {
    // Check if already running
    if (existsSync(PID_FILE)) {
      const pid = readFileSync(PID_FILE, "utf8")
      try {
        process.kill(Number.parseInt(pid), 0) // Check if process exists
        return NextResponse.json({
          success: false,
          message: "Prisma Studio is already running",
          port: PORT,
        })
      } catch {
        // Process doesn't exist, remove stale PID file
        require("fs").unlinkSync(PID_FILE)
      }
    }

    // Start Prisma Studio
    const studio = spawn("npx", ["prisma", "studio", "--port", PORT.toString()], {
      detached: true,
      stdio: "ignore",
    })

    studio.unref()

    // Save PID
    writeFileSync(PID_FILE, studio.pid!.toString())

    // Wait a moment for the server to start
    await new Promise((resolve) => setTimeout(resolve, 3000))

    return NextResponse.json({
      success: true,
      message: "Prisma Studio started successfully",
      port: PORT,
      pid: studio.pid,
    })
  } catch (error) {
    console.error("Error starting Prisma Studio:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to start Prisma Studio",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
