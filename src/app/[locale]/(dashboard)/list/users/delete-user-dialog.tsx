"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type DeleteUserDialogProps = {
  id: string
  onClose: () => void
  isPreview?: boolean
}

export const DeleteUserDialog = ({ id, onClose, isPreview = false }: DeleteUserDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      if (isPreview) {
        // Simulate API call in preview mode
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast("User deleted successfully (preview only)")

        onClose()
        return
      }

      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      toast("User deleted successfully")

      router.refresh()
      onClose()
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to delete user")
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        Delete User
        {isPreview && <span className="text-sm text-blue-600 ml-2">(Preview Mode)</span>}
      </h1>

      {isPreview && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            This is preview mode. In production, this will permanently delete the user from your Clerk organization.
          </p>
        </div>
      )}

      <p className="text-muted-foreground">
        Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user
        from your {isPreview ? "organization" : "Clerk organization"}.
      </p>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  )
}
// Note: This component is designed to be used in a modal or dialog con