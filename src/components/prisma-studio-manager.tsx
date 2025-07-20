"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Square, ExternalLink, Database, Loader2, AlertCircle, Info } from "lucide-react"
import { PrismaStudioModal } from "./prisma-studio-modal"
import { usePrismaStudio } from "@/hooks/use-prisma-studio"

export function PrismaStudioManager() {
  const { status, isLoading, error, startStudio, stopStudio } = usePrismaStudio()
  const [showModal, setShowModal] = useState(false)

  const handleOpenStudio = () => {
    setShowModal(true)
  }

  const handleOpenInNewTab = () => {
    if (status.url) {
      window.open(status.url, "_blank")
    }
  }

  return (
    <>
      <Card className="bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Prisma Studio
          </CardTitle>
          <CardDescription>Visual database browser and editor for your Prisma database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.isRunning ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="font-medium">Status: {status.isRunning ? "Running" : "Stopped"}</span>
              {status.isRunning && status.port && <Badge variant="secondary">Port {status.port}</Badge>}
            </div>
            {status.pid && <Badge variant="outline">PID: {status.pid}</Badge>}
          </div>

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Prisma Studio provides a visual interface to view and edit your database. The server will automatically
              start when you open the modal and stop when you close it.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={handleOpenStudio} disabled={isLoading} className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Database className="h-4 w-4" />
              Open Studio
            </Button>

            {status.isRunning && (
              <>
                <Button
                  variant="outline"
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4" />
                  New Tab
                </Button>
                <Button
                  variant="outline"
                  onClick={stopStudio}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
                  Stop
                </Button>
              </>
            )}

            {!status.isRunning && (
              <Button
                variant="outline"
                onClick={startStudio}
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Start
              </Button>
            )}
          </div>

          {status.isRunning && status.url && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Studio URL:</p>
              <code className="text-sm text-muted-foreground">{status.url}</code>
            </div>
          )}
        </CardContent>
      </Card>

      <PrismaStudioModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
