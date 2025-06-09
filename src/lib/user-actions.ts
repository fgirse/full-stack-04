"use server"

import { revalidatePath } from "next/cache"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "./prisma"
import type { UserSchema } from "./user-validation-schema"

type ActionState = {
  success: boolean
  error: boolean
  message: string
}

export const createUser = async (prevState: ActionState, data: UserSchema): Promise<ActionState> => {
  try {
    // Validate required fields
    if (!data.username || !data.email || !data.password || !data.firstName || !data.lastName) {
      return {
        success: false,
        error: true,
        message: "Missing required fields",
      }
    }

    // Check if username already exists in Clerk
    try {
      const existingUsers = await clerkClient.users.getUserList({
        username: [data.username],
      })

      if (existingUsers.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "Username already exists",
        }
      }
    } catch (error) {
      console.log("Username check error:", error)
    }

    // Check if email already exists in Clerk
    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [data.email],
      })

      if (existingUsers.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "Email already exists",
        }
      }
    } catch (error) {
      console.log("Email check error:", error)
    }

    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      username: data.username,
      emailAddress: [data.email],
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: data.role,
      },
      privateMetadata: {
        bloodType: data.bloodType,
        address: data.address,
        phone: data.phone,
      },
    })

    // Create user record in database based on role
    switch (data.role) {
      case "teacher":
        await prisma.teacher.create({
          data: {
            id: clerkUser.id,
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
            phone: data.phone || null,
            address: data.address || "",
            img: data.img || null,
            bloodType: data.bloodType || "O+",
            sex: data.sex || "MALE",
            birthday: data.birthday ? new Date(data.birthday) : new Date(),
            subjects: data.subjects
              ? {
                  connect: data.subjects.map((subjectId) => ({ id: Number.parseInt(subjectId) })),
                }
              : undefined,
          },
        })
        break

      case "student":
        // Check class capacity
        if (data.classId) {
          const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: { _count: { select: { students: true } } },
          })

          if (classItem && classItem.capacity <= classItem._count.students) {
            // Delete the Clerk user if class is full
            await clerkClient.users.deleteUser(clerkUser.id)
            return {
              success: false,
              error: true,
              message: "Class is at full capacity",
            }
          }
        }

        await prisma.student.create({
          data: {
            id: clerkUser.id,
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
            phone: data.phone || null,
            address: data.address || "",
            img: data.img || null,
            bloodType: data.bloodType || "O+",
            sex: data.sex || "MALE",
            birthday: data.birthday ? new Date(data.birthday) : new Date(),
            gradeId: data.gradeId || 1,
            classId: data.classId || 1,
            parentId: data.parentId || "",
          },
        })
        break

      case "parent":
        await prisma.parent.create({
          data: {
            id: clerkUser.id,
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
            phone: data.phone || null,
            address: data.address || "",
          },
        })
        break

      case "admin":
        await prisma.admin.create({
          data: {
            id: clerkUser.id,
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
          },
        })
        break
    }

    revalidatePath("/list/users")
    revalidatePath(`/list/${data.role}s`)

    return {
      success: true,
      error: false,
      message: `${data.role} created successfully`,
    }
  } catch (error: any) {
    console.error("Create user error:", error)

    // Handle specific Clerk errors
    if (error.errors) {
      const clerkError = error.errors[0]
      if (clerkError.code === "form_identifier_exists") {
        return {
          success: false,
          error: true,
          message: "Username or email already exists",
        }
      }
      if (clerkError.code === "form_password_pwned") {
        return {
          success: false,
          error: true,
          message: "Password is too common. Please choose a stronger password.",
        }
      }
      if (clerkError.code === "form_password_length_too_short") {
        return {
          success: false,
          error: true,
          message: "Password must be at least 8 characters long",
        }
      }
    }

    return {
      success: false,
      error: true,
      message: error.message || "Failed to create user. Please try again.",
    }
  }
}

export const updateUser = async (prevState: ActionState, data: UserSchema): Promise<ActionState> => {
  try {
    if (!data.id) {
      return {
        success: false,
        error: true,
        message: "User ID is required for updates",
      }
    }

    // Update user in Clerk
    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: data.role,
      },
      privateMetadata: {
        bloodType: data.bloodType,
        address: data.address,
        phone: data.phone,
      },
    }

    // Only update password if provided
    if (data.password && data.password.trim() !== "") {
      updateData.password = data.password
    }

    // Only update username if changed
    if (data.username) {
      updateData.username = data.username
    }

    await clerkClient.users.updateUser(data.id, updateData)

    // Update database record based on role
    const commonData = {
      username: data.username,
      name: data.firstName,
      surname: data.lastName,
      email: data.email,
      phone: data.phone || null,
      address: data.address || "",
      img: data.img || null,
      ...(data.bloodType && { bloodType: data.bloodType }),
      ...(data.sex && { sex: data.sex }),
      ...(data.birthday && { birthday: new Date(data.birthday) }),
    }

    switch (data.role) {
      case "teacher":
        await prisma.teacher.update({
          where: { id: data.id },
          data: {
            ...commonData,
            subjects: data.subjects
              ? {
                  set: data.subjects.map((subjectId) => ({ id: Number.parseInt(subjectId) })),
                }
              : undefined,
          },
        })
        break

      case "student":
        await prisma.student.update({
          where: { id: data.id },
          data: {
            ...commonData,
            ...(data.gradeId && { gradeId: data.gradeId }),
            ...(data.classId && { classId: data.classId }),
            ...(data.parentId && { parentId: data.parentId }),
          },
        })
        break

      case "parent":
        await prisma.parent.update({
          where: { id: data.id },
          data: {
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
            phone: data.phone || null,
            address: data.address || "",
          },
        })
        break

      case "admin":
        await prisma.admin.update({
          where: { id: data.id },
          data: {
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
          },
        })
        break
    }

    revalidatePath("/list/users")
    revalidatePath(`/list/${data.role}s`)

    return {
      success: true,
      error: false,
      message: `${data.role} updated successfully`,
    }
  } catch (error: any) {
    console.error("Update user error:", error)

    return {
      success: false,
      error: true,
      message: error.message || "Failed to update user. Please try again.",
    }
  }
}

export const deleteUser = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    const id = formData.get("id") as string
    const role = formData.get("role") as string

    if (!id || !role) {
      return {
        success: false,
        error: true,
        message: "User ID and role are required",
      }
    }

    // Delete from Clerk
    await clerkClient.users.deleteUser(id)

    // Delete from database based on role
    switch (role) {
      case "teacher":
        await prisma.teacher.delete({ where: { id } })
        break
      case "student":
        await prisma.student.delete({ where: { id } })
        break
      case "parent":
        await prisma.parent.delete({ where: { id } })
        break
      case "admin":
        await prisma.admin.delete({ where: { id } })
        break
    }

    revalidatePath("/list/users")
    revalidatePath(`/list/${role}s`)

    return {
      success: true,
      error: false,
      message: `${role} deleted successfully`,
    }
  } catch (error: any) {
    console.error("Delete user error:", error)

    return {
      success: false,
      error: true,
      message: error.message || "Failed to delete user. Please try again.",
    }
  }
}
