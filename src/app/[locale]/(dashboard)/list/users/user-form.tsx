"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"

type UserFormProps = {
  type: "create" | "update"
  data?: any
  onClose: () => void
  isPreview?: boolean
}

export const UserForm = ({ type, data, onClose, isPreview = false }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
       
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    role: data?.role || "student",
    phone: data?.phone || "",
    username: data?.username || "",
    password: "", // Only for create
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isPreview) {
        // Simulate API call in preview mode
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.info(`User ${type === "create" ? "created" : "updated"} successfully (preview only)`)

        onClose()
        return
      }

      const url = type === "create" ? "/api/users" : `/api/users/${data.id}`
      const method = type === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${type} user`)
      }

      toast.info(`User ${type === "create" ? "created" : "updated"} successfully`)

      router.refresh()
      onClose()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to ${type} user`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new user" : "Update user"}
        {isPreview && <span className="text-sm text-blue-600 ml-2">(Preview Mode)</span>}
      </h1>

      {isPreview && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            This is preview mode. In production, this will create/update real users in your Clerk organization.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            disabled={type === "update"} // Email cannot be changed in Clerk
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />
        </div>

        {type === "create" && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required={!isPreview}
              minLength={8}
              placeholder={isPreview ? "Password (preview mode)" : ""}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  )
}
