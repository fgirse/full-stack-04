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
import { Search, Users, Mail, Calendar, Shield, RefreshCw } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

type User = {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: { emailAddress: string; id:string }[]
  imageUrl: string
  createdAt: number
  lastSignInAt?: number
  banned?: boolean
  publicMetadata?: { role?: string }
  privateMetadata?: { role?: string }
  // add other fields as needed
}

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
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalCount, setTotalCount] = useState(0)
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
      setUsers(
              data.users.map((user) => ({
                ...user,
                imageUrl: user.imageUrl || "/placeholder.svg",
                lastSignInAt: user.lastSignInAt === null ? undefined : user.lastSignInAt,
              }))
            )
      setTotalCount(data.totalCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = (users ?? []).filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()
    const email = user.emailAddresses[0]?.emailAddress.toLowerCase() || ""
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

  const getUserRole = (user: User) => {
    return user.publicMetadata?.role || user.privateMetadata?.role || "user"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description", { count: totalCount })}</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh")}
        </Button>
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
        {(users ?? []).map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <CardTitle className="text-sm font-medium">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "No name provided"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getUserRole(user) === "admin" ? "default" : "secondary"} className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {getUserRole(user)}
                  </Badge>
                  {user.banned && (
                    <Badge variant="destructive" className="text-xs">
                      Banned
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2" />
                  <span className="truncate">{user.emailAddresses[0]?.emailAddress || "No email"}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-2" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                {user.lastSignInAt && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" />
                    <span>Last seen {formatDate(user.lastSignInAt)}</span>
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
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms." : "No users have been created yet."}
          </p>
        </div>
      )}
    </div>
  )
}
