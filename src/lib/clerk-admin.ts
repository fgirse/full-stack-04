import { clerkClient } from "@clerk/nextjs/server"

export async function createClerkUser(userData: {
  emailAddress: string
  firstName: string
  lastName: string
  password: string
  role: string
}) {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [userData.emailAddress],
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      publicMetadata: {
        role: userData.role,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error("Error creating Clerk user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
