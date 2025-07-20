"use client"
import { useState, useEffect, useCallback } from 'react'

interface StudioStatus {
  pid: any
  isRunning: boolean
  port: number | null
  url: string | null
}

export function usePrismaStudio() {
  const [status, setStatus] = useState<StudioStatus>({
    pid: null,
    isRunning: false,
    port: null,
    url: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/prisma-studio')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      setStatus({
        pid: data.pid ?? null,
        isRunning: data.isRunning,
        port: data.port,
        url: data.isRunning && data.port ? `http://localhost:${data.port}` : null
      })
      setError(null)
    } catch (err) {
      console.error('Failed to check status:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  const startStudio = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Starting Prisma Studio...')
      const response = await fetch('/api/prisma-studio?action=start')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Start response:', data)
      
      if (data.success) {
        setStatus({
          pid: data.pid ?? null,
          isRunning: true,
          port: data.port,
          url: `http://localhost:${data.port}`
        })
      } else {
        throw new Error(data.message || 'Failed to start Prisma Studio')
      }
    } catch (err) {
      console.error('Start error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start Prisma Studio')
      setStatus(prev => ({ ...prev, isRunning: false, url: null }))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopStudio = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Stopping Prisma Studio...')
      const response = await fetch('/api/prisma-studio?action=stop')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Stop response:', data)
      
      setStatus({
        pid: null,
        isRunning: false,
        port: null,
        url: null
      })
    } catch (err) {
      console.error('Stop error:', err)
      setError(err instanceof Error ? err.message : 'Failed to stop Prisma Studio')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check status on mount
  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  return {
    status,
    isLoading,
    error,
    startStudio,
    stopStudio,
    checkStatus
  }
}
