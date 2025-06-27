import { clerkClient } from "@clerk/nextjs/server"
import { UserTable } from "./user-table"
import { UserFormContainer } from "./user-form-container"

// Mock data for preview environment
const mockUsers = [
  {
    id: "user_2mQa8kF3H2nR7pL9sT6vX1wY",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@school.edu",
    role: "admin",
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    lastSignInAt: Date.now() - 86400000, // 1 day ago
    imageUrl: "/placeholder.svg?height=40&width=40",
    phone: "+1234567890",
    username: "johndoe",
  },
  {
    id: "user_3nRb9lG4I3oS8qM0tU7wY2xZ",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@school.edu",
    role: "teacher",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    lastSignInAt: Date.now() - 86400000 * 2, // 2 days ago
    imageUrl: "/placeholder.svg?height=40&width=40",
    phone: "+1234567891",
    username: "janesmith",
  },
  {
    id: "user_4oSc0mH5J4pT9rN1uV8xZ3yA",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@school.edu",
    role: "student",
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    lastSignInAt: Date.now() - 86400000 * 3, // 3 days ago
    imageUrl: "/placeholder.svg?height=40&width=40",
    phone: "+1234567892",
    username: "bobjohnson",
  },
  {
    id: "user_5pTd1nI6K5qU0sO2vW9yA4zB",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@school.edu",
    role: "parent",
    createdAt: Date.now() - 86400000 * 20, // 20 days ago
    lastSignInAt: Date.now() - 86400000 * 5, // 5 days ago
    imageUrl: "/placeholder.svg?height=40&width=40",
    phone: "+1234567893",
    username: "alicebrown",
  },
  {
    id: "user_6qUe2oJ7L6rV1tP3wX0zB5aC",
    firstName: "Charlie",
    lastName: "Wilson",
    email: "charlie.wilson@school.edu",
    role: "student",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    lastSignInAt: null, // Never signed in
    imageUrl: "/placeholder.svg?height=40&width=40",
    phone: "+1234567894",
    username: "charliewilson",
  },
  {
    id: "user_7rVf3pK8M7sW2uQ4xY1aC6bD",
    firstName: "Diana",
    lastName: "Davis",
    email: "diana.davis@school.edu",
    role: "teacher",
    createdAt: Date.now() - 86400000 * 25, // 25 days ago
    lastSignInAt: Date.now() - 86400000 * 4, // 4 days ago
    imageUrl: "/placeholder.svg?height=40&width=40",
    phone: "+1234567895",
    username: "dianadavis",
  },
]

export default async function UsersPage() {
  // Check if we're in a preview environment or if Clerk is properly configured
  const hasClerkKeys = process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // For preview/development without Clerk keys, use mock data
  if (!hasClerkKeys) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* Preview Mode Notice */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-sm font-medium text-blue-800">Preview Mode - Using Mock Data</h3>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            This is a preview with sample data. In production, connect to your Clerk instance and add middleware:
          </p>
          <div className="mt-2 p-2 bg-blue-100 rounded text-xs font-mono">
            <div className="mb-2">
              <strong>1. Environment Variables:</strong>
              <br />
              CLERK_SECRET_KEY=your_secret_key
              <br />
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
            </div>
            <div className="text-green-700">
              <strong>✅ Middleware already configured with role-based access!</strong>
            </div>
          </div>
        </div>

        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Users (Preview)</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18l-2 13H5L3 6z"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <UserFormContainer table="user" type="create" data={{}} />
            </div>
          </div>
        </div>

        {/* LIST */}
        <UserTable users={mockUsers} isPreview={true} currentUserRole="admin" />
      </div>
    )
  }

  // Production code with real Clerk integration
  try {
    // Import auth only when we have Clerk keys
    const { auth } = await import("@clerk/nextjs/server")
    const { sessionClaims } = auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    // Fetch users from Clerk with proper error handling
    const usersResponse = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    })

    // Check if we have valid data
    if (!usersResponse || !usersResponse.data) {
      throw new Error("No user data received from Clerk")
    }

    // Transform the data to include role information
    const usersWithRoles = usersResponse.data.map((user) => ({
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      role: (user.publicMetadata?.role as string) || "student",
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      imageUrl: user.imageUrl,
      phone: user.phoneNumbers[0]?.phoneNumber || "",
      username: user.username || "",
    }))

    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Users</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-magenta-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18l-2 13H5L3 6z"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              {role === "admin" && <UserFormContainer table="user" type="create" data={{}} />}
            </div>
          </div>
        </div>

        {/* LIST */}
        <UserTable users={usersWithRoles} isPreview={false} currentUserRole={role || "student"} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching users:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Users</h1>
          <p className="text-muted-foreground mt-2">Failed to fetch users from Clerk: {errorMessage}</p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-2xl mx-auto">
            <h3 className="text-sm font-medium text-red-800">Setup Required:</h3>
            <div className="text-sm text-red-700 mt-2">
              <div className="mb-3">
                <strong>1. Add Environment Variables:</strong>
                <div className="font-mono bg-red-100 p-2 rounded mt-1">
                  CLERK_SECRET_KEY=your_secret_key
                  <br />
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
                </div>
              </div>
              <div>
                <strong>2. Your middleware.ts is already configured!</strong>
                <div className="bg-green-100 p-2 rounded mt-1 text-green-700">
                  ✅ Clerk middleware detected with role-based access control
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
