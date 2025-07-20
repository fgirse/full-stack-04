import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const PID_FILE = join(process.cwd(), ".prisma-studio.pid")
const PORT = 5555

async function checkServerHealth(port: number): Promise<boolean> {
  try {
    // Example health check: try to connect to the server port
    const res = await fetch(`http://localhost:${port}`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    let isRunning = false
    let pid: number | null = null

    if (existsSync(PID_FILE)) {
      pid = Number.parseInt(readFileSync(PID_FILE, "utf8"))

      try {
        // Check if process exists
        process.kill(pid, 0)

        // Check if server is actually responding
        isRunning = await checkServerHealth(PORT)

        if (!isRunning) {
          // Process exists but server not responding, clean up
          require("fs").unlinkSync(PID_FILE)
          pid = null
        }
      } catch {
        // Process doesn't exist, clean up PID file
        require("fs").unlinkSync(PID_FILE)
        pid = null
      }
    }

    return NextResponse.json({
      isRunning,
      port: isRunning ? PORT : null,
      pid: isRunning ? pid : null,
      url: isRunning ? `http://localhost:${PORT}` : null,
    })
  } catch (error) {
    console.error("Error checking Prisma Studio status:", error)
    return NextResponse.json(
      {
        isRunning: false,
        port: null,
        pid: null,
        url: null,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
