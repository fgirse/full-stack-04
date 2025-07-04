"use client"

import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import * as SeperatorPrimitive from "@radix-ui/react-separator";
import { Mail, Shield, User, Clock } from "lucide-react"
import { Separator } from "@radix-ui/react-separator"

interface ClerkUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{
    emailAddress: string
    id: string
  }>
  imageUrl: string
  createdAt: number
  lastSignInAt: number | null
  publicMetadata: Record<string, any>
  privateMetadata: Record<string, any>
  banned: boolean
}

interface ViewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: ClerkUser
}

export function ViewUserModal({ open, onOpenChange, user }: ViewUserModalProps) {
  const t = useTranslations("UserManagement")

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U"
  }

  const getUserRole = (user: ClerkUser) => {
    return user.publicMetadata?.role || user.privateMetadata?.role || "user"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("userDetails")}</DialogTitle>
          <DialogDescription>{t("viewUserDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {user.firstName || user.lastName
                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                  : t("noName")}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={getUserRole(user) === "admin" ? "default" : "secondary"}>
                  <Shield className="h-3 w-3 mr-1" />
                  {t(`roles.${getUserRole(user)}`)}
                </Badge>
                {user.banned && <Badge variant="destructive">{t("banned")}</Badge>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t("contactInformation")}
            </h4>
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("email")}</span>
                <span className="text-sm">{user.emailAddresses[0]?.emailAddress || t("noEmail")}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("accountInformation")}
            </h4>
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("userId")}</span>
                <span className="text-sm font-mono">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("status")}</span>
                <Badge variant={user.banned ? "destructive" : "secondary"}>
                  {user.banned ? t("banned") : t("active")}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("activityInformation")}
            </h4>
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("joinedDate")}</span>
                <span className="text-sm">{formatDate(user.createdAt)}</span>
              </div>
              {user.lastSignInAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("lastSignIn")}</span>
                  <span className="text-sm">{formatDate(user.lastSignInAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          {(Object.keys(user.publicMetadata).length > 0 || Object.keys(user.privateMetadata).length > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">{t("metadata")}</h4>
                <div className="pl-6 space-y-2">
                  {Object.keys(user.publicMetadata).length > 0 && (
                    <div>
                      <span className="text-sm font-medium">{t("publicMetadata")}:</span>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(user.publicMetadata, null, 2)}
                      </pre>
                    </div>
                  )}
                  {Object.keys(user.privateMetadata).length > 0 && (
                    <div>
                      <span className="text-sm font-medium">{t("privateMetadata")}:</span>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(user.privateMetadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
