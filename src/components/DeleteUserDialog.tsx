"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

interface ClerkUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{
    emailAddress: string
    id: string
  }>
}

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: ClerkUser
  onDeleteUser: (userId: string) => Promise<void>
}

export function DeleteUserDialog({ open, onOpenChange, user, onDeleteUser }: DeleteUserDialogProps) {
  const t = useTranslations("UserManagement")
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDeleteUser(user.id)
    } finally {
      setLoading(false)
    }
  }

  const userName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.emailAddresses[0]?.emailAddress || "Unknown User"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteUserTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteUserDescription", { userName })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("deleteUser")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
