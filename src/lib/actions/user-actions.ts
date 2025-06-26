"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function syncUserToDatabase(userId: string) {
  try {
    const { userId: currentUserId } = await auth()

    if (!currentUserId) {
      throw new Error("Unauthorized")
    }

    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId)

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        username: clerkUser.username || "",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
      },
      create: {
        id: userId,
        username: clerkUser.username || "",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
      },
    })

    revalidatePath("/users")
    return { success: true, user: dbUser }
  } catch (error) {
    console.error("Error syncing user to database:", error)
    return { success: false, error: "Failed to sync user" }
  }
}

export async function createUserProfile(userId: string, role: string, additionalData: any) {
  try {
    const { userId: currentUserId } = await auth()

    if (!currentUserId) {
      throw new Error("Unauthorized")
    }

    // Create role-specific profile based on the role
    switch (role) {
      case "student":
        await prisma.student.create({
          data: {
            id: userId,
            username: additionalData.username,
            name: additionalData.firstName,
            surname: additionalData.lastName,
            email: additionalData.email,
            phone: additionalData.phone,
            address: additionalData.address,
            bloodType: additionalData.bloodType,
            sex: additionalData.sex,
            birthday: new Date(additionalData.birthday),
            parentId: additionalData.parentId,
            classId: additionalData.classId,
            gradeId: additionalData.gradeId,
          },
        })
        break

      case "teacher":
        await prisma.teacher.create({
          data: {
            id: userId,
            username: additionalData.username,
            name: additionalData.firstName,
            surname: additionalData.lastName,
            email: additionalData.email,
            phone: additionalData.phone,
            address: additionalData.address,
            bloodType: additionalData.bloodType,
            sex: additionalData.sex,
            birthday: new Date(additionalData.birthday),
          },
        })
        break

      case "parent":
        await prisma.parent.create({
          data: {
            id: userId,
            username: additionalData.username,
            name: additionalData.firstName,
            surname: additionalData.lastName,
            email: additionalData.email,
            phone: additionalData.phone,
            address: additionalData.address,
          },
        })
        break

      case "admin":
        await prisma.admin.create({
          data: {
            id: userId,
            username: additionalData.username,
          },
        })
        break
    }

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return { success: false, error: "Failed to create user profile" }
  }
}

export async function deleteUserProfile(userId: string) {
  try {
    const { userId: currentUserId } = await auth()

    if (!currentUserId) {
      throw new Error("Unauthorized")
    }

    // Delete from all possible tables
    await Promise.allSettled([
      prisma.student.delete({ where: { id: userId } }),
      prisma.teacher.delete({ where: { id: userId } }),
      prisma.parent.delete({ where: { id: userId } }),
      prisma.admin.delete({ where: { id: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user profile:", error)
    return { success: false, error: "Failed to delete user profile" }
  }
}

// CREATE a new user
export async function createUser(data: {
  id: string
  username: string
  email: string
  role: string
}) {
  try {
    const { userId: currentUserId } = await auth()
    if (!currentUserId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.create({
      data,
    })

    revalidatePath("/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

// READ (get) a user by ID
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return { success: false, error: "User not found" }
    }
    return { success: true, user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

// READ (get) all users
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany()
    return { success: true, users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

// UPDATE a user by ID
export async function updateUser(userId: string, data: Partial<{ username: string; email: string; role: string }>) {
  try {
    const { userId: currentUserId } = await auth()
    if (!currentUserId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    })

    revalidatePath("/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

// DELETE a user by ID (already implemented as deleteUserProfile)
