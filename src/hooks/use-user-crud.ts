"use client"

import { useState, useCallback } from "react"
import type { User, FilterOptions, CrudResult } from "@/lib/crud-algorithms"

export function useUserCrud() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequest = useCallback(async (request: () => Promise<CrudResult<any>>): Promise<any | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await request()

      if (result.success) {
        return result.data || null
      } else {
        setError(result.error || "Operation failed")
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(
    async (userData: Partial<User> & { password?: string }) => {
      return handleRequest(async () => {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create user")
        }

        const result = await response.json()
        return { success: true, data: result.user }
      })
    },
    [handleRequest],
  )

  const getUsers = useCallback(
    async (filters: FilterOptions = {}) => {
      return handleRequest(async () => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })

        const response = await fetch(`/api/users?${params}`)

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const result = await response.json()
        return { success: true, data: result }
      })
    },
    [handleRequest],
  )

  const updateUser = useCallback(
    async (userId: number, updateData: Partial<User>) => {
      return handleRequest(async () => {
        const response = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update user")
        }

        const result = await response.json()
        return { success: true, data: result.user }
      })
    },
    [handleRequest],
  )

  const deleteUser = useCallback(
    async (userId: number) => {
      return handleRequest(async () => {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to delete user")
        }

        return { success: true }
      })
    },
    [handleRequest],
  )

  const bulkUpdateUsers = useCallback(
    async (userIds: number[], updateData: Partial<User>) => {
      return handleRequest(async () => {
        const response = await fetch("/api/users/bulk", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds, updateData }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to bulk update users")
        }

        const result = await response.json()
        return { success: true, data: result.successCount }
      })
    },
    [handleRequest],
  )

  const bulkDeleteUsers = useCallback(
    async (userIds: number[]) => {
      return handleRequest(async () => {
        const response = await fetch("/api/users/bulk", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to bulk delete users")
        }

        const result = await response.json()
        return { success: true, data: result.successCount }
      })
    },
    [handleRequest],
  )

  return {
    loading,
    error,
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    bulkDeleteUsers,
  }
}
