"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Users, Mail, Calendar, Shield, RefreshCw, Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { AdminNavigation } from "../../../../../components/AdminNavigation";
import { CreateUserModal } from "../../../../../components/CreateUserModal"
import { EditUserModal } from "../../../../../components/EditUserModal";
import { DeleteUserDialog } from "../../../../../components/DeleteUserDialog";
import { ViewUserModal } from "../../../../../components/ViewUserModal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Separator } from "../../../../../components/ui/separator";
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

interface UsersResponse {
  users: ClerkUser[]
  totalCount: number
}

export default function UsersPage() {
  const t = useTranslations("UserManagement")
  const [users, setUsers] = useState<ClerkUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalCount, setTotalCount] = useState(0)
  const [selectedUser, setSelectedUser] = useState<ClerkUser | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { getToken } = useAuth()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await getToken()
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setTotalCount(data.totalCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: any) => {
    try {
      const token = await getToken()
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      toast.success("User created successfully")
      setShowCreateModal(false)
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user")
    }
  }

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const token = await getToken()
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user")
      }

      toast.success("User updated successfully")
      setShowEditModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = await getToken()
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      toast.success("User deleted successfully")
      setShowDeleteDialog(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user")
    }
  }

  const handleBanUser = async (userId: string, banned: boolean) => {
    try {
      const token = await getToken()
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ banned }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user status")
      }

      toast.success(banned ? "User banned successfully" : "User unbanned successfully")
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user status")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()
    const primaryEmailObj =
      user.emailAddresses.find((e) => e.id === user.publicMetadata?.primaryEmailId) ||
      user.emailAddresses[0]
    const email = primaryEmailObj?.emailAddress?.toLowerCase() || ""
    const search = searchTerm.toLowerCase()

    return fullName.includes(search) || email.includes(search)
  })

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <AdminNavigation />
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-10 w-full max-w-md" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminNavigation />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description", { count: totalCount })}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("createUser")}
          </Button>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 flex-1">
                <CardTitle className="text-sm font-medium">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : t("noName")}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getUserRole(user) === "admin" ? "default" : "secondary"} className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {t(`roles.${getUserRole(user)}`)}
                  </Badge>
                  {user.banned && (
                    <Badge variant="destructive" className="text-xs">
                      {t("banned")}
                    </Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user)
                      setShowViewModal(true)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t("viewUser")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user)
                      setShowEditModal(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t("editUser")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBanUser(user.id, !user.banned)}>
                    <Shield className="mr-2 h-4 w-4" />
                    {user.banned ? t("unbanUser") : t("banUser")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user)
                      setShowDeleteDialog(true)
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("deleteUser")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2" />
                  <span className="truncate">{user.emailAddresses[0]?.emailAddress || t("noEmail")}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-2" />
                  <span>
                    {t("joined")} {formatDate(user.createdAt)}
                  </span>
                </div>
                {user.lastSignInAt && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" />
                    <span>
                      {t("lastSeen")} {formatDate(user.lastSignInAt)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("noUsersFound")}</h3>
          <p className="text-muted-foreground">{searchTerm ? t("adjustSearch") : t("noUsersCreated")}</p>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreateUser={handleCreateUser} />

      {selectedUser && (
        <>
          <EditUserModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            user={selectedUser}
            onUpdateUser={handleUpdateUser}
          />

          <ViewUserModal open={showViewModal} onOpenChange={setShowViewModal} user={selectedUser} />

          <DeleteUserDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            user={selectedUser}
            onDeleteUser={handleDeleteUser}
          />
        </>
      )}
    </div>
  )
}
