"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Calendar, TrendingUp, GraduationCap } from "lucide-react"

interface StudentDashboardProps {
  user: any
  data: any
}

export function StudentDashboard({ user, data }: StudentDashboardProps) {
  const calculateAttendanceRate = () => {
    if (!data?.attendances?.length) return 0
    const presentCount = data.attendances.filter((att: any) => att.present).length
    return Math.round((presentCount / data.attendances.length) * 100)
  }

  const calculateAverageScore = () => {
    if (!data?.results?.length) return 0
    const totalScore = data.results.reduce((sum: number, result: any) => sum + result.score, 0)
    return Math.round(totalScore / data.results.length)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Student Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.class?.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Grade {data?.grade?.level}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAttendanceRate()}%</div>
            <p className="text-xs text-muted-foreground">Last 10 lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverageScore()}</div>
            <p className="text-xs text-muted-foreground">Recent results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.results?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Full Name:</span>
                <p className="text-sm text-muted-foreground">
                  {data?.name} {data?.surname}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Student ID:</span>
                <p className="text-sm text-muted-foreground">{data?.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm text-muted-foreground">{data?.email || user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Phone:</span>
                <p className="text-sm text-muted-foreground">{data?.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Address:</span>
                <p className="text-sm text-muted-foreground">{data?.address || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Blood Type:</span>
                <p className="text-sm text-muted-foreground">{data?.bloodType || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Birthday:</span>
                <p className="text-sm text-muted-foreground">
                  {data?.birthday ? new Date(data.birthday).toLocaleDateString() : "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Parent:</span>
                <p className="text-sm text-muted-foreground">
                  {data?.parent ? `${data.parent.name} ${data.parent.surname}` : "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Information */}
      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{data?.class?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Grade {data?.grade?.level} • {data?.grade?.description}
                </p>
              </div>
              <Badge variant="outline">
                {data?.class?.students?.length || 0} / {data?.class?.capacity} students
              </Badge>
            </div>
            {data?.class?.supervisor && (
              <div>
                <span className="text-sm font-medium">Class Supervisor:</span>
                <p className="text-sm text-muted-foreground">
                  {data.class.supervisor.name} {data.class.supervisor.surname}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.results?.length ? (
                data.results.slice(0, 5).map((result: any) => {
                  const subject = result.exam?.lesson?.subject?.name || result.assignment?.lesson?.subject?.name
                  const type = result.exam ? "Exam" : "Assignment"
                  const title = result.exam?.title || result.assignment?.title

                  return (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subject}</p>
                          <p className="text-sm text-muted-foreground">{title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={result.exam ? "default" : "secondary"}>{type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{result.score}</TableCell>
                      <TableCell>
                        <Badge
                          variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}
                        >
                          {result.score >= 80 ? "A" : result.score >= 60 ? "B" : "C"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(result.exam?.startTime || result.assignment?.dueDate)}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No results available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Attendance Rate</span>
              <span className="text-sm text-muted-foreground">{calculateAttendanceRate()}%</span>
            </div>
            <Progress value={calculateAttendanceRate()} className="h-2" />

            <div className="space-y-2">
              {data?.attendances?.slice(0, 5).map((attendance: any) => (
                <div key={attendance.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{attendance.lesson?.subject?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(attendance.date)}</p>
                  </div>
                  <Badge variant={attendance.present ? "default" : "destructive"}>
                    {attendance.present ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
