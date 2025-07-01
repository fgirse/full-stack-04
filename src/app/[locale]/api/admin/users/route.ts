import { auth, clerkClient } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import useTranslations from "@/hooks/useTranslations"
import { type User } from "@/types/user"

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth()

    const t = useTranslations("UserManagement")

    if (!userId) {
      return NextResponse.json({ error: <p>{t("Unauthorized - No user ID")}</p> , { status: 401 })
    }

    // Optional: Check if user has admin role
    const currentUser = await clerkClient.users.getUser(userId)
    const userRole = currentUser.publicMetadata?.role || currentUser.privateMetadata?.role

    if (userRole !== "admin") {    return NextResponse.json({ error: {t("Forbidden - Admin access required") }, { status: 403 })
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    console.log(`Fetching users with limit: ${limit}, offset: ${offset}`)

    // Fetch users from Clerk
    const response = await clerkClient.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
    })

    console.log(`Found ${response.data.length} users, total: ${response.totalCount}`)

    // Transform the data to match your interface
    const users = response.data.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses.map((email) => ({
        emailAddress: email.emailAddress,
        id: email.id,
      })),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      banned: user.banned,
    }))

    return NextResponse.json({
      users,
      totalCount: response.totalCount,
    })
  } catch (error) {
    console.error("Error fetching users:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

