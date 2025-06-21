import { clerkClient } from "@clerk/nextjs/server"
import { UserTable } from "./user-table"

export default async function UsersPage() {
  try {
    // Fetch users from Clerk
    const users = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    })

    // Transform the data to include role information
    const usersWithRoles = users.data.map((user) => ({
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      role: (user.publicMetadata?.role as string) || "student", // Default to student
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      imageUrl: user.imageUrl,
    }))

    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage users and their roles in your application</p>
        </div>

        <UserTable users={usersWithRoles} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Users</h1>
          <p className="text-muted-foreground mt-2">
            Failed to fetch users from Clerk. Please check your configuration.
          </p>
        </div>
      </div>
    )
  }
}
