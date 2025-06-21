"use server"

import { sql } from "../lib/database"
import { createClerkUser } from "@/lib/clerk-admin"
import { revalidatePath } from "next/cache"

export type UserRole = "admin" | "student" | "teacher" | "parent"

export interface CreateUserData {
  email: string
  firstName: string
  lastName: string
  password: string
  role: UserRole
  // Role-specific data
  department?: string // for admin
  permissions?: string[] // for admin
  gradeLevel?: number // for student
  subject?: string // for teacher
  phone?: string // for parent
}

export async function createUserWithRole(formData: FormData) {
  try {
    const userData: CreateUserData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as UserRole,
      department: (formData.get("department") as string) || undefined,
      gradeLevel: formData.get("gradeLevel") ? Number.parseInt(formData.get("gradeLevel") as string) : undefined,
      subject: (formData.get("subject") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
    }

    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.lastName || !userData.password || !userData.role) {
      return { success: false, error: "All required fields must be filled" }
    }

    // Create user in Clerk
    const clerkResult = await createClerkUser({
      emailAddress: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      role: userData.role,
    })

    if (!clerkResult.success) {
      return { success: false, error: clerkResult.error }
    }

    const clerkUserId = clerkResult.user!.id
    const userId = crypto.randomUUID()

    // Create user record in database
    try {
      await sql`
        INSERT INTO users (id, clerk_user_id, email, first_name, last_name, role)
        VALUES (${userId}, ${clerkUserId}, ${userData.email}, ${userData.firstName}, ${userData.lastName}, ${userData.role})
      `
    } catch (error) {
      console.error("Error creating user record:", error)
      return { success: false, error: "Failed to create user record in database" }
    }

    // Create role-specific record
    let roleResult
    switch (userData.role) {
      case "admin":
        roleResult = await createAdminRecord(userId, userData)
        break
      case "student":
        roleResult = await createStudentRecord(userId, userData)
        break
      case "teacher":
        roleResult = await createTeacherRecord(userId, userData)
        break
      case "parent":
        roleResult = await createParentRecord(userId, userData)
        break
    }

    if (!roleResult?.success) {
      return { success: false, error: roleResult?.error || "Failed to create role-specific record" }
    }

    revalidatePath("/admin/users")
    return {
      success: true,
      message: `${userData.role} user created successfully`,
      userId: clerkUserId,
    }
  } catch (error) {
    console.error("Error in createUserWithRole:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

async function createAdminRecord(userId: string, userData: CreateUserData) {
  try {
    await sql`
      INSERT INTO admins (user_id, department, permissions)
      VALUES (${userId}, ${userData.department || null}, ${userData.permissions || ["read"]})
    `
    return { success: true }
  } catch (error) {
    console.error("Error creating admin record:", error)
    return { success: false, error: "Failed to create admin record" }
  }
}

async function createStudentRecord(userId: string, userData: CreateUserData) {
  try {
    // Generate student number
    const studentNumber = await generateStudentNumber()

    await sql`
      INSERT INTO students (user_id, student_number, grade_level)
      VALUES (${userId}, ${studentNumber}, ${userData.gradeLevel || null})
    `
    return { success: true }
  } catch (error) {
    console.error("Error creating student record:", error)
    return { success: false, error: "Failed to create student record" }
  }
}

async function createTeacherRecord(userId: string, userData: CreateUserData) {
  try {
    // Generate employee ID
    const employeeId = await generateEmployeeId()

    await sql`
      INSERT INTO teachers (user_id, employee_id, subject)
      VALUES (${userId}, ${employeeId}, ${userData.subject || null})
    `
    return { success: true }
  } catch (error) {
    console.error("Error creating teacher record:", error)
    return { success: false, error: "Failed to create teacher record" }
  }
}

async function createParentRecord(userId: string, userData: CreateUserData) {
  try {
    await sql`
      INSERT INTO parents (user_id, phone)
      VALUES (${userId}, ${userData.phone || null})
    `
    return { success: true }
  } catch (error) {
    console.error("Error creating parent record:", error)
    return { success: false, error: "Failed to create parent record" }
  }
}

// Helper functions to generate IDs
async function generateStudentNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `STU${year}`

  try {
    const result = await sql`
      SELECT student_number 
      FROM students 
      WHERE student_number LIKE ${prefix + "%"} 
      ORDER BY student_number DESC 
      LIMIT 1
    `

    let nextNumber = 1
    if (result.length > 0) {
      const lastNumber = result[0].student_number.replace(prefix, "")
      nextNumber = Number.parseInt(lastNumber) + 1
    }

    return `${prefix}${nextNumber.toString().padStart(4, "0")}`
  } catch (error) {
    // Fallback to random number if query fails
    return `${prefix}${Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")}`
  }
}

async function generateEmployeeId(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `EMP${year}`

  try {
    const result = await sql`
      SELECT employee_id 
      FROM teachers 
      WHERE employee_id LIKE ${prefix + "%"} 
      ORDER BY employee_id DESC 
      LIMIT 1
    `

    let nextNumber = 1
    if (result.length > 0) {
      const lastNumber = result[0].employee_id.replace(prefix, "")
      nextNumber = Number.parseInt(lastNumber) + 1
    }

    return `${prefix}${nextNumber.toString().padStart(4, "0")}`
  } catch (error) {
    // Fallback to random number if query fails
    return `${prefix}${Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")}`
  }
}

export async function getUsersList() {
  try {
    const users = await sql`
      SELECT 
        u.*,
        a.department as admin_department,
        s.student_number, s.grade_level,
        t.employee_id, t.subject,
        p.phone as parent_phone
      FROM users u
      LEFT JOIN admins a ON u.id = a.user_id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN teachers t ON u.id = t.user_id
      LEFT JOIN parents p ON u.id = p.user_id
      ORDER BY u.created_at DESC
    `

    return { success: true, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}
