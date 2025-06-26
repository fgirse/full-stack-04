"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter } from "lucide-react"
import { UserFormContainer } from "./user-form-container"
import { getUserPermissions } from "@/lib/settings"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: number
  lastSignInAt: number | null
  imageUrl: string
  phone?: string
  username?: string
}

interface UserTableProps {
  users: User[]
  isPreview?: boolean
  currentUserRole?: string
}

type FormContainerProps = {
  table: string;
  type: "update" | "delete";
  data: User;
  isPreview?: boolean;
}

const roleColors = {
  admin: "bg-red-100 text-red-800 hover:bg-red-200",
  teacher: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  student: "bg-green-100 text-green-800 hover:bg-green-200",
  parent: "bg-purple-100 text-purple-800 hover:bg-purple-200",
}

export function UserTable({ users, isPreview = false, currentUserRole = "student" }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  // Get user permissions based on current user role
  const permissions = getUserPermissions(currentUserRole)

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderRow = (item: User) => (
    <TableRow key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50">
      <TableCell className="flex items-center gap-4 p-4">
        <Image
          src={item.imageUrl ? item.imageUrl : "/placeholder.svg?height=40&width=40"}
          alt={`${item.firstName} ${item.lastName}'s profile picture`}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{item.username || item.id.slice(0, 8)}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge
          variant="secondary"
          className={roleColors[item.role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"}
        >
          {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell">{item.phone || "-"}</TableCell>
      <TableCell className="hidden lg:table-cell">{formatDate(item.createdAt)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {permissions.canViewUsers && (
            <Link href={`/users/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-200 hover:bg-sky-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </Link>
          )}
          {(permissions.canEditUsers || isPreview) && (
            <UserFormContainer table="user" type="update" data={item} isPreview={isPreview} />
          )}
          {(permissions.canDeleteUsers || isPreview) && (
            <UserFormContainer table="user" type="delete" data={item} isPreview={isPreview} />
          )}
        </div>
      </TableCell>
    </TableRow>
  )

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "User ID",
      accessor: "userId",
      className: "hidden md:table-cell",
    },
    {
      header: "Role",
      accessor: "role",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Created",
      accessor: "created",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "actions",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Role-based access notice */}
      {!isPreview && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-sm text-green-700">
              <strong>Role:</strong> {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)} |
              <strong> Permissions:</strong> {permissions.canCreateUsers ? "Create" : ""}{" "}
              {permissions.canEditUsers ? "Edit" : ""} {permissions.canDeleteUsers ? "Delete" : ""}{" "}
              {permissions.canViewUsers ? "View" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
        {isPreview && <span className="text-blue-600 ml-2">(Preview Data)</span>}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessor} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No users found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => renderRow(user))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
