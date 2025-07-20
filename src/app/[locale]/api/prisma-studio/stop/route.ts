import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync, unlinkSync } from "fs"
import { join } from "path"

const PID_FILE = join(process.cwd(), ".prisma-studio.pid")

export async function POST(request: NextRequest) {
  try {
    if (!existsSync(PID_FILE)) {
      return NextResponse.json({
        success: false,
        message: "Prisma Studio is not running",
      })
    }

    const pid = Number.parseInt(readFileSync(PID_FILE, "utf8"))

    try {
      // Kill the process
      process.kill(pid, "SIGTERM")

      // Wait a moment for graceful shutdown
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Force kill if still running
      try {
        process.kill(pid, 0)
        process.kill(pid, "SIGKILL")
      } catch {
        // Process already terminated
      }

      // Remove PID file
      unlinkSync(PID_FILE)

      return NextResponse.json({
        success: true,
        message: "Prisma Studio stopped successfully",
      })
    } catch (error) {
      // Process might already be dead, clean up PID file
      unlinkSync(PID_FILE)
      return NextResponse.json({
        success: true,
        message: "Prisma Studio was not running",
      })
    }
  } catch (error) {
    console.error("Error stopping Prisma Studio:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to stop Prisma Studio",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
