"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { usePrismaStudio } from "@/hooks/use-prisma-studio"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PrismaStudioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrismaStudioModal({ open, onOpenChange }: PrismaStudioModalProps) {
  const { status, isLoading, error, startStudio, stopStudio } = usePrismaStudio()
  const [isStarting, setIsStarting] = useState(false)

  // Add debugging
  console.log('Modal state:', { open, status, isLoading, error, isStarting })

  // Auto-start when modal opens
  useEffect(() => {
    console.log('Auto-start effect:', { open, isRunning: status.isRunning, isLoading })
    if (open && !status.isRunning && !isLoading) {
      setIsStarting(true)
      startStudio().finally(() => setIsStarting(false))
    }
  }, [open, status.isRunning, isLoading, startStudio])

  // Auto-stop when modal closes
  useEffect(() => {
    if (!open && status.isRunning) {
      stopStudio()
    }
  }, [open, status.isRunning, stopStudio])

  const handleOpenInNewTab = () => {
    if (status.url) {
      window.open(status.url, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[78vw] h-[86vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Prisma Studio</span>
            <div className="flex items-center gap-2">
              {status.isRunning && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.isRunning ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-muted-foreground">{status.isRunning ? "Running" : "Stopped"}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {error && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(isLoading || isStarting) && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">{isStarting ? "Starting Prisma Studio..." : "Loading..."}</p>
              </div>
            </div>
          )}

          {!isLoading && !isStarting && status.isRunning && status.url && (
            <div className="flex-1 border rounded-lg overflow-hidden">
              <iframe
                src={status.url}
                className="w-full h-full border-0"
                title="Prisma Studio"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          )}

          {!isLoading && !isStarting && !status.isRunning && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Prisma Studio Not Running</h3>
                <p className="text-muted-foreground mb-4">
                  Prisma Studio will start automatically when you open this modal.
                </p>
                <Button onClick={startStudio} disabled={isLoading}>
                  {isLoading && <Loader2 className="bg-slate-200 hover:bg-orange-400 mr-2 h-4 w-4 animate-spin" />}
                  Start Prisma Studio
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
