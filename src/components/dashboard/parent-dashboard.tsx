"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, GraduationCap, Phone, Mail } from "lucide-react"

interface ParentDashboardProps {
  user: any
  data: any
}

export function ParentDashboard({ user, data }: ParentDashboardProps) {
  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Parent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.students?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.students?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Current enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Status</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="default">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Communication enabled</p>
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
                <span className="text-sm font-medium">Parent ID:</span>
                <p className="text-sm text-muted-foreground">{data?.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Registration Date:</span>
                <p className="text-sm text-muted-foreground">
                  {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Information */}
      <Card>
        <CardHeader>
          <CardTitle>Children</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.students?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.students.map((student: any) => (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={student.img || "/placeholder.svg"}
                          alt={`${student.name} ${student.surname}`}
                        />
                        <AvatarFallback>{getInitials(student.name, student.surname)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">
                          {student.name} {student.surname}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{student.class?.name}</Badge>
                          <Badge variant="secondary">Grade {student.grade?.level}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{student.grade?.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{student.email || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{student.phone || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Birthday:</span>
                        <span>
                          {student.birthday ? new Date(student.birthday).toLocaleDateString() : "Not provided"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Grades
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No children registered</p>
              <Button variant="outline" className="mt-4">
                Register Child
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              Contact Teachers
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <GraduationCap className="h-6 w-6 mb-2" />
              View Grades
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Phone className="h-6 w-6 mb-2" />
              Schedule Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
