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
    const { banned } = await request.json()

    // Ban/unban user via Clerk Backend API
    const endpoint = banned
      ? `https://api.clerk.com/v1/users/${userId}/ban`
      : `https://api.clerk.com/v1/users/${userId}/unban`

    const clerkResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json()
      console.error("Clerk API Error:", errorData)
      return NextResponse.json(
        { error: errorData.errors?.[0]?.message || "Failed to update user status" },
        { status: clerkResponse.status },
      )
    }

    const result = await clerkResponse.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating user ban status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
