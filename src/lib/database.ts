import { neon } from "@neondatabase/serverless"

// Use the available DATABASE_URL environment variable
const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Test database connection
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database connection failed",
    }
  }
}