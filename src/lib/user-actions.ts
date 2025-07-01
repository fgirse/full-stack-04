import prisma from "@/lib/prisma"
import type { User } from "@prisma/client"

export async function getUserList(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function createOrUpdateUser(userData: {
  username: any
  password: any
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userData.clerkId },
      update: {
        email: userData.email,
      },
      create: {
        clerkId: userData.clerkId,
        email: userData.email,
        username: userData.username, // <-- required
    password: userData.password, // <-- required
      },
    })
    return user
  } catch (error) {
    console.error("Error creating/updating user:", error)
    throw new Error("Failed to create or update user")
  }
}
