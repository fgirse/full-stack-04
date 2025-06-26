import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if we have Clerk keys
    const hasClerkKeys = process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

    if (!hasClerkKeys) {
      return NextResponse.json({ error: "Clerk not configured. This is a preview environment." }, { status: 400 })
    }

    // Import Clerk modules only when we have keys
    const { clerkClient } = await import("@clerk/nextjs/server")

    const body = await request.json()
    const { role } = body

    const clerk = await clerkClient()

    // Update user role in Clerk
    const user = await clerk.users.updateUser(params.id, {
      publicMetadata: {
        role,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
