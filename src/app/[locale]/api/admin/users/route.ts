import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    // Verify the user is authenticated and has admin role
    const { sessionClaims } = await auth()

    if (!sessionClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Fetch users from Clerk Backend API
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!clerkResponse.ok) {
      const errorText = await clerkResponse.text()
      console.error("Clerk API Error:", errorText)
      return NextResponse.json({ error: "Failed to fetch users from Clerk" }, { status: clerkResponse.status })
    }

    const users = await clerkResponse.json()

    // Transform the data to include only necessary fields
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      emailAddresses: user.email_addresses,
      imageUrl: user.image_url,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      publicMetadata: user.public_metadata,
      privateMetadata: user.private_metadata,
      banned: user.banned,
    }))

    return NextResponse.json({
      users: transformedUsers,
      totalCount: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionClaims } = await auth()

    if (!sessionClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { firstName, lastName, emailAddress, password, role: userRole } = body

    // Create user via Clerk Backend API
    const clerkResponse = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_address: [emailAddress],
        password,
        public_metadata: {
          role: userRole,
        },
      }),
    })

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json()
      console.error("Clerk API Error:", errorData)
      return NextResponse.json(
        { error: errorData.errors?.[0]?.message || "Failed to create user" },
        { status: clerkResponse.status },
      )
    }

    const newUser = await clerkResponse.json()
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}




