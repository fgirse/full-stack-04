"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "../../../../../../hooks/use-toast.jsx";
interface RoleSelectorProps {
  userId: string
  currentRole: string
  onRoleChange?: (newRole: string) => void
}

export function RoleSelector({ userId, currentRole, onRoleChange }: RoleSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      toast({
        title: "Role updated",
        description: `User role has been changed to ${newRole}`,
      })

      onRoleChange?.(newRole)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select value={currentRole} onValueChange={handleRoleChange} disabled={isUpdating}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="teacher">Teacher</SelectItem>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="parent">Parent</SelectItem>
      </SelectContent>
    </Select>
  )
}
