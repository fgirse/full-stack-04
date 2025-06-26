import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if we have Clerk keys
    const hasClerkKeys = process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

    if (!hasClerkKeys) {
      return NextResponse.json({ error: "Clerk not configured. This is a preview environment." }, { status: 400 })
    }

    // Import Clerk modules only when we have keys
    const { clerkClient } = await import("@clerk/nextjs/server")
    const { auth } = await import("@clerk/nextjs/server")

    // Check if user is admin
    const { sessionClaims } = auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { firstName, lastName, role: userRole, phone, username } = body

    const clerk = await clerkClient()

    // Update user in Clerk
    const updateData: any = {
      firstName,
      lastName,
      publicMetadata: {
        role: userRole || "student",
      },
    }

    if (username) {
      updateData.username = username
    }

    const user = await clerk.users.updateUser(params.id, updateData)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if we have Clerk keys
    const hasClerkKeys = process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

    if (!hasClerkKeys) {
      return NextResponse.json({ error: "Clerk not configured. This is a preview environment." }, { status: 400 })
    }

    // Import Clerk modules only when we have keys
    const { clerkClient } = await import("@clerk/nextjs/server")
    const { auth } = await import("@clerk/nextjs/server")

    // Check if user is admin
    const { sessionClaims } = auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const clerk = await clerkClient()

    // Delete user from Clerk
    await clerk.users.deleteUser(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 },
    )
  }
}
