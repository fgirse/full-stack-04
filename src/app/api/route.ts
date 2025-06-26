import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { firstName, lastName, email, role: userRole, phone, username, password } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 })
    }

    const clerk = await clerkClient()

    // Create user in Clerk
    const createUserData: any = {
      firstName,
      lastName,
      emailAddress: [email],
      publicMetadata: {
        role: userRole || "student",
      },
    }

    if (phone) {
      createUserData.phoneNumber = [phone]
    }

    if (username) {
      createUserData.username = username
    }

    if (password) {
      createUserData.password = password
    }

    const user = await clerk.users.createUser(createUserData)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error creating user:", error)

    // Handle specific Clerk errors
    if (error instanceof Error) {
      if (error.message.includes("email_address_exists")) {
        return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 })
      }
      if (error.message.includes("username_exists")) {
        return NextResponse.json({ error: "This username is already taken" }, { status: 400 })
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 },
    )
  }
}
