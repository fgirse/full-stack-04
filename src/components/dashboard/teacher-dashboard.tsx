"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react"

interface TeacherDashboardProps {
  user: any
  data: any
}

export function TeacherDashboard({ user, data }: TeacherDashboardProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Teacher Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.subjects?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Teaching subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.classes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Supervising classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.classes?.reduce((total: number, cls: any) => total + (cls.students?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.lessons?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Weekly lessons</p>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data?.subjects?.length ? (
              data.subjects.map((subject: any) => (
                <Badge key={subject.id} variant="secondary">
                  {subject.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No subjects assigned</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.lessons?.length ? (
                data.lessons.map((lesson: any) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.name}</TableCell>
                    <TableCell>{lesson.subject?.name}</TableCell>
                    <TableCell>{lesson.class?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lesson.day}</Badge>
                    </TableCell>
                    <TableCell>
                      {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No lessons scheduled
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Supervised Classes */}
      {data?.classes?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Supervised Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.classes.map((cls: any) => (
                <Card key={cls.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{cls.name}</h3>
                        <Badge variant="outline">Grade {cls.grade?.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cls.students?.length || 0} students • Capacity: {cls.capacity}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{cls.grade?.description}</span>
                        <Button variant="outline" size="sm">
                          View Class
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
