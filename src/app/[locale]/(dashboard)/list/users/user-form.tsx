"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "../../../../../..//hooks/use-toast"

interface User {
  id?: number
  email: string
  first_name: string
  last_name: string
  role: string
  phone?: string
  address?: string
  date_of_birth?: string
  role_data?: any
}

interface UserFormProps {
  user?: User
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    role: user?.role || "student",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.date_of_birth || "",
    password: "",
    // Role-specific data
    roleData: {
      // Teacher fields
      employeeId: user?.role_data?.employee_id || "",
      department: user?.role_data?.department || "",
      subject: user?.role_data?.subject || "",
      hireDate: user?.role_data?.hire_date || "",
      salary: user?.role_data?.salary || "",
      qualification: user?.role_data?.qualification || "",
      experienceYears: user?.role_data?.experience_years || 0,
      // Student fields
      studentId: user?.role_data?.student_id || "",
      gradeLevel: user?.role_data?.grade_level || "",
      classSection: user?.role_data?.class_section || "",
      enrollmentDate: user?.role_data?.enrollment_date || "",
      parentId: user?.role_data?.parent_id || "",
      emergencyContact: user?.role_data?.emergency_contact || "",
      medicalInfo: user?.role_data?.medical_info || "",
      // Parent fields
      occupation: user?.role_data?.occupation || "",
      workplace: user?.role_data?.workplace || "",
      relationshipToStudent: user?.role_data?.relationship_to_student || "",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = user ? `/api/users/${user.id}` : "/api/users"
      const method = user ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save user")
      }

      toast({
        title: "Success",
        description: `User ${user ? "updated" : "created"} successfully`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "teacher":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Teacher Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.roleData.employeeId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, employeeId: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.roleData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, department: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.roleData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, subject: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.roleData.hireDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, hireDate: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.roleData.salary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, salary: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience (Years)</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={formData.roleData.experienceYears}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, experienceYears: Number.parseInt(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Textarea
                id="qualification"
                value={formData.roleData.qualification}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    roleData: { ...prev.roleData, qualification: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        )

      case "student":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={formData.roleData.studentId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, studentId: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Input
                  id="gradeLevel"
                  value={formData.roleData.gradeLevel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, gradeLevel: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="classSection">Class Section</Label>
                <Input
                  id="classSection"
                  value={formData.roleData.classSection}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, classSection: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.roleData.enrollmentDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, enrollmentDate: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.roleData.emergencyContact}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, emergencyContact: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="medicalInfo">Medical Information</Label>
              <Textarea
                id="medicalInfo"
                value={formData.roleData.medicalInfo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    roleData: { ...prev.roleData, medicalInfo: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        )

      case "parent":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Parent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.roleData.occupation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, occupation: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="workplace">Workplace</Label>
                <Input
                  id="workplace"
                  value={formData.roleData.workplace}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, workplace: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="relationshipToStudent">Relationship to Student</Label>
                <Select
                  value={formData.roleData.relationshipToStudent}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, relationshipToStudent: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parentEmergencyContact">Emergency Contact</Label>
                <Input
                  id="parentEmergencyContact"
                  value={formData.roleData.emergencyContact}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleData: { ...prev.roleData, emergencyContact: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{user ? "Edit User" : "Add New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
            {!user && (
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  required={!user}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Role-specific fields */}
          {renderRoleSpecificFields()}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
