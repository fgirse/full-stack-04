"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, UserPlus, Activity, Shield, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { AdminNavigation } from "../../../../../components/AdminNavigation"
import { RegistrationChart } from "../../../../../components/RegistrationChart";

interface AdminStats {
  totalUsers: number
  newUsersThisMonth: number
  newUsersThisWeek: number
  activeUsersThisWeek: number
  bannedUsers: number
  roleDistribution: Record<string, number>
  registrationTrend: Array<{ date: string; count: number }>
}

export default function AdminDashboard() {
  const t = useTranslations("AdminDashboard")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await getToken()
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(t("Failed to fetch statistics"))
      }

      const data: AdminStats = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <AdminNavigation />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <AdminNavigation />
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminNavigation />

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{t("allRegisteredUsers")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("newThisMonth")}</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newUsersThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">{t("registeredThisMonth")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activeThisWeek")}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsersThisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">{t("signedInThisWeek")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("bannedUsers")}</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.bannedUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{t("currentlyBanned")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Additional Info */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Registration Trend Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("registrationTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent>{stats?.registrationTrend && <RegistrationChart data={stats.registrationTrend} />}</CardContent>
        </Card>

        {/* Role Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("roleDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.roleDistribution &&
                Object.entries(stats.roleDistribution).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={role === "admin" ? "default" : "secondary"}>{t(`roles.${role}`)}</Badge>
                    </div>
                    <div className="text-sm font-medium">{count}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.newUsersThisWeek || 0}</div>
              <p className="text-sm text-muted-foreground">{t("newUsersThisWeek")}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">{stats?.activeUsersThisWeek || 0}</div>
              <p className="text-sm text-muted-foreground">{t("activeUsersThisWeek")}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats ? Math.round((stats.activeUsersThisWeek / stats.totalUsers) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">{t("engagementRate")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
