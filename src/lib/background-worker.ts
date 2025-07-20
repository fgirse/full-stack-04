class BackgroundWorker {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  start() {
    if (this.isRunning) return

    this.isRunning = true
    console.log("Background worker started")

    // Run immediately
    this.processJobs()

    // Then run every 10 seconds
    this.intervalId = setInterval(() => {
      this.processJobs()
    }, 10000)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log("Background worker stopped")
  }

  private async processJobs() {
    try {
      console.log("Processing background jobs...", new Date().toISOString())

      // Simulate background work
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Your background logic here
      // - Process queued emails
      // - Clean up temporary files
      // - Update cache
      // - Sync with external APIs

      console.log("Background jobs completed")
    } catch (error) {
      console.error("Background job error:", error)
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: new Date().toISOString(),
    }
  }
}

export const backgroundWorker = new BackgroundWorker()

// Auto-start in production
if (process.env.NODE_ENV === "production") {
  backgroundWorker.start()
}
