import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { sessionClaims } = await auth()

    if (!sessionClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { userId } = await params
    const body = await request.json()

    // Update user via Clerk Backend API
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: body.firstName,
        last_name: body.lastName,
        public_metadata: body.publicMetadata,
        private_metadata: body.privateMetadata,
      }),
    })

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json()
      console.error("Clerk API Error:", errorData)
      return NextResponse.json(
        { error: errorData.errors?.[0]?.message || "Failed to update user" },
        { status: clerkResponse.status },
      )
    }

    const updatedUser = await clerkResponse.json()
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { sessionClaims } = await auth()

    if (!sessionClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { userId } = await params

    // Delete user via Clerk Backend API
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json()
      console.error("Clerk API Error:", errorData)
      return NextResponse.json(
        { error: errorData.errors?.[0]?.message || "Failed to delete user" },
        { status: clerkResponse.status },
      )
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
