"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, RefreshCw } from "lucide-react"

interface ClerkUser {
  id: string
  external_id: string | null
  username: string | null
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
  attrs: any
}

export default function UserManagement() {
  const [users, setUsers] = useState<ClerkUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<ClerkUser[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize Supabase client with error handling
  const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    return createClient(supabaseUrl, supabaseKey)
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("clerk.users").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter((user) => {
      const searchLower = searchTerm.toLowerCase()
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim().toLowerCase()
      const username = user.username?.toLowerCase() || ""
      const email = user.attrs?.email_addresses?.[0]?.email_address?.toLowerCase() || ""

      return fullName.includes(searchLower) || username.includes(searchLower) || email.includes(searchLower)
    })
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  if (error) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Configuration Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchUsers} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">{users.length} total users from Clerk</p>
        </div>
        <Button onClick={fetchUsers} disabled={loading} size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const emailAddresses = user.attrs?.email_addresses || []
            const primaryEmail = emailAddresses[0]?.email_address || "No email"
            const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U"

            return (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.attrs?.image_url || "/placeholder.svg"} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                          : user.username || "Unnamed User"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">{primaryEmail}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && searchTerm && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
