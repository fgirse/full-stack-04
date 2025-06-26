import { neon } from "@neondatabase/serverless"
// import { toast } from "some-toast-library" // Adjust the import based on the actual toast library used
import { toast } from "react-hot-toast" // Replace with your actual toast library if different

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

// Assuming this function is part of the file where user deletion is handled
export async function deleteUser(userId: any) {
  try {
    await sql`DELETE FROM users WHERE id = ${userId}`
    toast.success("User deleted successfully")
    return { success: true }
  } catch (error) {
    toast.error("Failed to delete user")
    }
  }
