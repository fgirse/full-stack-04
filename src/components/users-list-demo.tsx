"use client"

import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RefreshCw, Users, AlertCircle } from "lucide-react"

export function UsersListDemo() {
  const { users, loading, error, refetch, total } = useUsers()

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <div>
              <CardTitle>Users from API</CardTitle>
              <CardDescription>Live data from /api/users endpoint</CardDescription>
            </div>
          </div>
          <Button onClick={refetch} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span>Loading users...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total users: {total}</p>
              <Badge variant="secondary">API Call Success</Badge>
            </div>

            <div className="grid gap-3">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 border rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt="User avatar" />
                    <AvatarFallback className="text-xs">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "No name"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.emailAddresses[0]?.emailAddress || "No email"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              ))}

              {users.length > 3 && (
                <p className="text-sm text-muted-foreground text-center py-2">... and {users.length - 3} more users</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
