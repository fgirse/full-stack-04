"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Settings, UserCheck, GraduationCap, Heart } from "lucide-react"
import UserManagementModal from "./user-management-modal"

interface AdminUserManagementButtonProps {
  className?: string
}

export default function AdminUserManagementButton({ className }: AdminUserManagementButtonProps) {
  const [selectedAction, setSelectedAction] = useState<"create" | "update" | "delete" | null>(null)
  const [selectedRole, setSelectedRole] = useState<"admin" | "teacher" | "student" | "parent" | null>(null)

  const relatedData = {
    subjects: [
      { id: "1", name: "Mathematics" },
      { id: "2", name: "Science" },
      { id: "3", name: "English" },
      { id: "4", name: "History" },
      { id: "5", name: "Physical Education" },
    ],
    classes: [
      { id: "1", name: "Class A" },
      { id: "2", name: "Class B" },
      { id: "3", name: "Class C" },
    ],
    grades: [
      { id: "1", level: "Grade 1" },
      { id: "2", level: "Grade 2" },
      { id: "3", level: "Grade 3" },
      { id: "4", level: "Grade 4" },
      { id: "5", level: "Grade 5" },
    ],
  }

  const handleCreateUser = (role: "admin" | "teacher" | "student" | "parent") => {
    setSelectedRole(role)
    setSelectedAction("create")
  }

  const resetSelection = () => {
    setSelectedAction(null)
    setSelectedRole(null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={className}>
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Clerk User Management
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">CREATE NEW USER</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => handleCreateUser("admin")} className="cursor-pointer">
            <Users className="h-4 w-4 mr-2 text-red-500" />
            <span>Create Administrator</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleCreateUser("teacher")} className="cursor-pointer">
            <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
            <span>Create Teacher</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleCreateUser("student")} className="cursor-pointer">
            <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
            <span>Create Student</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleCreateUser("parent")} className="cursor-pointer">
            <Heart className="h-4 w-4 mr-2 text-purple-500" />
            <span>Create Parent</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">MANAGE USERS</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <a href="/admin/users" className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              <span>View All Users</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Creation Modal */}
      {selectedAction === "create" && selectedRole && (
        <UserManagementModal
          type="create"
          userData={{ role: selectedRole }}
          relatedData={relatedData}
          trigger={<div style={{ display: "none" }} />}
        />
      )}
    </>
  )
}
