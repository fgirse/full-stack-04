"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, UserCheck, Users2, BookOpen, Calendar, FileText, ClipboardList, School } from "lucide-react"

interface DatabaseStats {
  totals: {
    admins: number
    students: number
    teachers: number
    parents: number
    classes: number
    subjects: number
    lessons: number
    exams: number
    assignments: number
    events: number
    announcements: number
  }
  recent: {
    students: Array<{
      name: string
      surname: string
      createdAt: string
    }>
    events: Array<{
      title: string
      startTime: string
      class: { name: string } | null
    }>
  }
}

export function DatabaseStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/database/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        setError("Failed to load database statistics")
        console.error("Error fetching stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">{error || "No data available"}</p>
        </CardContent>
      </Card>
    )
  }

  const statCards = [
    {
      title: "Students",
      value: stats.totals.students,
      icon: GraduationCap,
      description: "Total enrolled students",
    },
    {
      title: "Teachers",
      value: stats.totals.teachers,
      icon: UserCheck,
      description: "Active teaching staff",
    },
    {
      title: "Parents",
      value: stats.totals.parents,
      icon: Users2,
      description: "Registered parents",
    },
    {
      title: "Classes",
      value: stats.totals.classes,
      icon: School,
      description: "Active classes",
    },
    {
      title: "Subjects",
      value: stats.totals.subjects,
      icon: BookOpen,
      description: "Available subjects",
    },
    {
      title: "Lessons",
      value: stats.totals.lessons,
      icon: Calendar,
      description: "Scheduled lessons",
    },
    {
      title: "Exams",
      value: stats.totals.exams,
      icon: FileText,
      description: "Total exams",
    },
    {
      title: "Assignments",
      value: stats.totals.assignments,
      icon: ClipboardList,
      description: "Active assignments",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Students</CardTitle>
            <CardDescription>Latest student registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.students.map((student, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {student.name} {student.surname}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(student.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
              ))}
              {stats.recent.students.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent students</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>Recent and upcoming school events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.events.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.class?.name && `${event.class.name} • `}
                      {new Date(event.startTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
              {stats.recent.events.length === 0 && <p className="text-sm text-muted-foreground">No recent events</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
