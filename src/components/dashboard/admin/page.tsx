"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from "i18next"

interface AdminDashboardProps {
  user: any
  data: any
}

interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalParents: number
  totalClasses: number
  totalSubjects: number
  recentActivities: any[]
}

export function AdminDashboard({ user, data }: AdminDashboardProps) {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  const t = useTranslations("AdminDashboard")
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("{t("Error fetching admin stats:")}, error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div>{t("Loading dashboard...")}   </div>
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Users")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{t("All system users")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStudents</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Active students")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Teachers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Teaching staff")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Classes")}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClasses || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Active classes")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Administrator Information")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{t("System Access")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Full administrative privileges with access to all system functions")}
              </p>
            </div>
            <div>
              <h3 className="font-medium">{t("Responsibilities")}</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("User management and role assignment")}</li>
                <li>• {t("System configuration and settings")}</li>
                <li>• {t("Data backup and security oversight")}</li>
                <li>• {t("Performance monitoring and optimization")}  </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activities */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Recent System Activities")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentActivities?.length ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("No recent activities")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
