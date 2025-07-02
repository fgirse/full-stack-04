import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {useTranslations} from 'next-intl'

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

    // Fetch users from Clerk Backend API
    const clerkResponse = await fetch("https://api.clerk.com/v1/users?limit=1000", {
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

    // Calculate statistics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const stats = {
      totalUsers: users.length,
      newUsersThisMonth: users.filter((user: any) => new Date(user.created_at) >= thirtyDaysAgo).length,
      newUsersThisWeek: users.filter((user: any) => new Date(user.created_at) >= sevenDaysAgo).length,
      activeUsersThisWeek: users.filter(
        (user: any) => user.last_sign_in_at && new Date(user.last_sign_in_at) >= sevenDaysAgo,
      ).length,
      bannedUsers: users.filter((user: any) => user.banned).length,
      roleDistribution: users.reduce((acc: Record<string, number>, user: any) => {
        const role = user.public_metadata?.role || user.private_metadata?.role || "user"
        acc[role] = (acc[role] || 0) + 1
        return acc
      }, {}),
      registrationTrend: calculateRegistrationTrend(users),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateRegistrationTrend(users: any[]) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return {
      date: date.toISOString().split("T")[0],
      count: 0,
    }
  }).reverse()

  users.forEach((user: any) => {
    const userDate = new Date(user.created_at).toISOString().split("T")[0]
    const dayData = last30Days.find((day) => day.date === userDate)
    if (dayData) {
      dayData.count++
    }
  })

  return last30Days
}
