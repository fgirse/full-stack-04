import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing Supabase URL. Please add NEXT_PUBLIC_SUPABASE_URL to your environment variables.");
}

if (!supabaseServiceKey) {
  throw new Error(
    "Missing Supabase key. Please add SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY to your environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// CRUD Operations for the `users` table

// Create a new user
export async function createUser(userData: { username: string; email: string; password: string }) {
  const { data, error } = await supabase.from("users").insert([userData]);
  if (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
  return data;
}

// Read users
export async function getUsers() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
  return data;
}

// Update a user
export async function updateUser(userId: string, updates: { username?: string; email?: string }) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId);
  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
  return data;
}

// Delete a user
export async function deleteUser(userId: string) {
  const { data, error } = await supabase.from("users").delete().eq("id", userId);
  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
  return data;
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("users").select("id");
    if (error) {
      throw new Error(`Supabase connection error: ${error.message}`);
    }
    return data;
  } catch (err) {
    throw new Error(`Failed to connect to Supabase: ${err instanceof Error ? err.message : String(err)}`);
  }
}