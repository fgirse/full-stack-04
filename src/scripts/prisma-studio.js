#!/usr/bin/env node

const { spawn } = require("child_process")
const { writeFileSync, readFileSync, existsSync, unlinkSync } = require("fs")
const { join } = require("path")

const PID_FILE = join(process.cwd(), ".prisma-studio.pid")
const PORT = 5555

const command = process.argv[2]

switch (command) {
  case "start":
    startStudio()
    break
  case "stop":
    stopStudio()
    break
  case "status":
    checkStatus()
    break
  default:
    console.log("Usage: node scripts/prisma-studio.js [start|stop|status]")
}

function startStudio() {
  if (existsSync(PID_FILE)) {
    const pid = readFileSync(PID_FILE, "utf8")
    try {
      process.kill(Number.parseInt(pid), 0)
      console.log("Prisma Studio is already running")
      return
    } catch {
      unlinkSync(PID_FILE)
    }
  }

  console.log("Starting Prisma Studio...")
  const studio = spawn("npx", ["prisma", "studio", "--port", PORT.toString()], {
    detached: true,
    stdio: "ignore",
  })

  studio.unref()
  writeFileSync(PID_FILE, studio.pid.toString())
  console.log(`Prisma Studio started on port ${PORT} (PID: ${studio.pid})`)
}

function stopStudio() {
  if (!existsSync(PID_FILE)) {
    console.log("Prisma Studio is not running")
    return
  }

  const pid = Number.parseInt(readFileSync(PID_FILE, "utf8"))

  try {
    process.kill(pid, "SIGTERM")
    unlinkSync(PID_FILE)
    console.log("Prisma Studio stopped")
  } catch {
    unlinkSync(PID_FILE)
    console.log("Prisma Studio was not running")
  }
}

function checkStatus() {
  if (!existsSync(PID_FILE)) {
    console.log("Status: Stopped")
    return
  }

  const pid = Number.parseInt(readFileSync(PID_FILE, "utf8"))

  try {
    process.kill(pid, 0)
    console.log(`Status: Running (PID: ${pid}, Port: ${PORT})`)
  } catch {
    unlinkSync(PID_FILE)
    console.log("Status: Stopped")
  }
}
