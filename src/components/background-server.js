const express = require("express")
const app = express()
const PORT = process.env.BACKGROUND_PORT || 3001

app.use(express.json())

// Background server routes
app.get("/health", (req, res) => {
  res.json({ status: "Background server running", timestamp: new Date().toISOString() })
})

app.post("/background-task", (req, res) => {
  // Simulate background processing
  console.log("Processing background task:", req.body)

  // Simulate async work
  setTimeout(() => {
    console.log("Background task completed")
  }, 2000)

  res.json({ message: "Task queued for background processing" })
})

// Background job processor
setInterval(() => {
  console.log("Background job running at:", new Date().toISOString())
  // Your background logic here
}, 30000) // Run every 30 seconds

app.listen(PORT, () => {
  console.log(`Background server running on port ${PORT}`)
})
