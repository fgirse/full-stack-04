"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const checkBackgroundServer = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3001/health")
      const data = await response.json()
      setStatus(`Background server: ${data.status} at ${data.timestamp}`)
    } catch (error) {
      setStatus("Background server not reachable")
    }
    setLoading(false)
  }

  const triggerBackgroundTask = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3001/background-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: "example-task", data: "sample data" }),
      })
      const data = await response.json()
      setStatus(data.message)
    } catch (error) {
      setStatus("Failed to trigger background task")
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Next.js with Background Server</CardTitle>
          <CardDescription>Main Next.js app running on port 3000, background server on port 3001</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkBackgroundServer} disabled={loading} className="w-full">
            Check Background Server
          </Button>

          <Button
            onClick={triggerBackgroundTask}
            disabled={loading}
            variant="outline"
            className="w-full bg-transparent"
          >
            Trigger Background Task
          </Button>

          {status && <div className="p-3 bg-muted rounded-md text-sm">{status}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
