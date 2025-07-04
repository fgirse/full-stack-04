"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ClerkUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{
    emailAddress: string
    id: string
  }>
  publicMetadata: Record<string, any>
  privateMetadata: Record<string, any>
}

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: ClerkUser
  onUpdateUser: (userId: string, userData: any) => Promise<void>
}

export function EditUserModal({ open, onOpenChange, user, onUpdateUser }: EditUserModalProps) {
  const t = useTranslations("UserManagement")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "user",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.publicMetadata?.role || user.privateMetadata?.role || "user",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onUpdateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        publicMetadata: {
          ...user.publicMetadata,
          role: formData.role,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editUser")}</DialogTitle>
          <DialogDescription>{t("editUserDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {t("firstName")}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                {t("lastName")}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("email")}
              </Label>
              <Input id="email" value={user.emailAddresses[0]?.emailAddress || ""} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t("role")}
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("roles.user")}</SelectItem>
                  <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                  <SelectItem value="teacher">{t("roles.teacher")}</SelectItem>
                  <SelectItem value="student">{t("roles.student")}</SelectItem>
                  <SelectItem value="parent">{t("roles.parent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("updateUser")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
