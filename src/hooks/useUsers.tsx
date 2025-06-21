"use client"

import { useState, useEffect, useCallback } from "react"

interface ClerkUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{
    emailAddress: string
    id: string
  }>
  imageUrl: string
  username: string | null
  createdAt: number
  lastSignInAt: number | null
  banned: boolean
  role: string
}

interface UseUsersReturn {
  users: ClerkUser[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  total: number
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<ClerkUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔄 Fetching users from /api/users...")

      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      console.log("✅ Users fetched successfully:", {
        count: data.users?.length || 0,
        total: data.total || 0,
      })

      setUsers(data.users || [])
      setTotal(data.total || data.users?.length || 0)
    } catch (err) {
      console.error("❌ Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fetch on mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    total,
  }
}

