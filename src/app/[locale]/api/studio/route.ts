import { type NextRequest, NextResponse } from "next/server"
import { createPrismaPostgresHttpClient } from "@prisma/studio-core/data/ppg"
import { serializeError } from "@prisma/studio-core/data/bff"

export async function POST(request: NextRequest) {
  try {
    // Extract the query from the request body
    const { query } = await request.json()

    // Get the database URL from environment variables
    const url = process.env.DATABASE_URL
    const port = process.env.NEXT_PUBLIC_SERVER_PORT;

    if (!url) {
      return NextResponse.json([serializeError(new Error("DATABASE_URL environment variable is not set"))], {
        status: 500,
      })
    }

    // Execute the query against Prisma Postgres
    const [error, results] = await createPrismaPostgresHttpClient({ url }).execute(query)

    // Return results or errors
    if (error) {
      return NextResponse.json([serializeError(error)])
    }

    return NextResponse.json([null, results])
  } catch (error) {
    console.error("Studio API error:", error)
    return NextResponse.json([serializeError(error instanceof Error ? error : new Error("Unknown error"))], {
      status: 500,
    })
  }
}
