"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Eye, EyeOff, Upload, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import { createUser, updateUser } from "@/lib/user-actions"
import { userSchema, type UserSchema } from "@/lib/user-validation-schema"

interface UserFormProps {
  type: "create" | "update"
  data?: any
  onClose: () => void
  relatedData?: {
    subjects?: Array<{ id: string; name: string }>
    classes?: Array<{ id: string; name: string }>
    grades?: Array<{ id: string; level: string }>
  }
}

export default function UserForm({ type, data, onClose, relatedData }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(data?.img || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: data?.role || "student",
      ...data,
    },
  })

  const [state, formAction] = useFormState(type === "create" ? createUser : updateUser, {
    success: false,
    error: false,
    message: "",
  })

  const selectedRole = watch("role")

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true)
    try {
      formAction({
            ...formData,
            img: profileImage ?? undefined,
            id: type === "update" ? data?.id : undefined,
        })
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  })

  useEffect(() => {
    if (state.success) {
      toast.success(`User has been ${type === "create" ? "created" : "updated"} successfully!`)
      reset()
      setProfileImage(null)
      onClose()
      router.refresh()
    } else if (state.error && state.message) {
      toast.error(state.message)
    }
  }, [state, router, type, onClose, reset])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{type === "create" ? "Create New User" : "Update User"}</CardTitle>
            <CardDescription>
              {type === "create"
                ? "Add a new user to the system with Clerk authentication"
                : "Update user information and sync with Clerk"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Error Display */}
          {state.error && state.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue("role", value as "admin" | "teacher" | "student" | "parent")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          {/* Authentication Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Authentication Information</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password {type === "create" ? "*" : "(leave blank to keep current)"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder={type === "create" ? "Enter password" : "Enter new password"}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Personal Information</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Date of Birth</Label>
                <Input
                  id="birthday"
                  type="date"
                  {...register("birthday")}
                  className={errors.birthday ? "border-red-500" : ""}
                />
                {errors.birthday && <p className="text-sm text-red-500">{errors.birthday.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Gender</Label>
                <Select onValueChange={(value) => setValue("sex", value as "MALE" | "FEMALE")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-sm text-red-500">{errors.sex.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select onValueChange={(value) => setValue("bloodType", value as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bloodType && <p className="text-sm text-red-500">{errors.bloodType.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Enter full address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>
          </div>

          {/* Role-specific fields */}
          {selectedRole === "teacher" && relatedData?.subjects && (
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects</Label>
              <Select onValueChange={(value) => setValue("subjects", [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subjects" />
                </SelectTrigger>
                <SelectContent>
                  {relatedData.subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedRole === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedData?.grades && (
                <div className="space-y-2">
                  <Label htmlFor="gradeId">Grade</Label>
                  <Select onValueChange={(value) => setValue("gradeId", Number.parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {relatedData.grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {relatedData?.classes && (
                <div className="space-y-2">
                  <Label htmlFor="classId">Class</Label>
                  <Select onValueChange={(value) => setValue("classId", Number.parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {relatedData.classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Profile Image */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Profile Image</Badge>
            </div>

            <div className="flex items-center gap-4">
              {profileImage ? (
                <div className="relative">
                  <Image
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div>
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>Upload Image</span>
                  </Button>
                </Label>
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <p className="text-sm text-gray-500 mt-1">Recommended: Square image, max 2MB</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {type === "create" ? "Creating..." : "Updating..."}
                </>
              ) : type === "create" ? (
                "Create User"
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
