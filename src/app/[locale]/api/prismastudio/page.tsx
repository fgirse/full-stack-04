"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, ExternalLink, Loader2, AlertCircle, ArrowLeft, Play, Square } from "lucide-react"
import { usePrismaStudio } from "@/hooks/use-prisma-studio"
import { PrismaStudioModal } from "@/components/prisma-studio-modal"
import Link from "next/link"

export default function PrismaStudioPage() {
  const { status, isLoading, error, startStudio, stopStudio } = usePrismaStudio()
  const [showModal, setShowModal] = useState(false)

  const handleOpenInNewTab = () => {
    if (status.url) {
      window.open(status.url, "_blank")
    }
  }

  return (
    <>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prisma Studio</h1>
            <p className="text-muted-foreground">Visual database browser and editor</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Server Status
              </CardTitle>
              <CardDescription>Current status of the Prisma Studio server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${status.isRunning ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="font-medium">{status.isRunning ? "Running" : "Stopped"}</span>
                </div>
                {status.isRunning && status.port && <Badge variant="secondary">Port {status.port}</Badge>}
              </div>

              {status.pid && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Process ID:</span>
                  <Badge variant="outline">{status.pid}</Badge>
                </div>
              )}

              {status.url && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Server URL:</span>
                  <code className="block p-2 bg-muted rounded text-sm">{status.url}</code>
                </div>
              )}

              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {!status.isRunning ? (
                  <Button onClick={startStudio} disabled={isLoading} className="flex items-center gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Start Server
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={stopStudio}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
                    Stop Server
                  </Button>
                )}

                {status.isRunning && (
                  <Button
                    variant="outline"
                    onClick={handleOpenInNewTab}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common database management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setShowModal(true)} className="w-full flex items-center gap-2" size="lg">
                <Database className="h-5 w-5" />
                Open Studio in Modal
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">View Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleOpenInNewTab} disabled={!status.isRunning}>
                  External View
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The modal will automatically start the server when opened and stop it when closed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {status.isRunning && status.url && (
          <Card>
            <CardHeader>
              <CardTitle>Embedded Studio</CardTitle>
              <CardDescription>Prisma Studio running in an embedded frame</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                <iframe
                  src={status.url}
                  className="w-full h-full border-0"
                  title="Prisma Studio"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <PrismaStudioModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
