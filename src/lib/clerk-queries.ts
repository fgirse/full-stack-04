import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface UserFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
  hasEmail?: boolean
  hasPhone?: boolean
  limit?: number
  offset?: number
}

export async function getUsers(filters: UserFilters = {}) {
  let query = supabase.from("clerk.users").select(`
      id,
      username,
      first_name,
      last_name,
      created_at,
      updated_at,
      attrs
    `)

  // Apply filters
  if (filters.dateFrom) {
    query = query.gte("created_at", filters.dateFrom)
  }

  if (filters.dateTo) {
    query = query.lte("created_at", filters.dateTo)
  }

  // Apply ordering and pagination
  query = query
    .order("created_at", { ascending: false })
    .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50) - 1)

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  return data?.map((user) => ({
    ...user,
    email: user.attrs?.email_addresses?.[0]?.email_address || null,
    phone: user.attrs?.phone_numbers?.[0]?.phone_number || null,
    image_url: user.attrs?.image_url || null,
    last_sign_in_at: user.attrs?.last_sign_in_at || null,
  }))
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase.from("clerk.users").select("*").eq("id", userId).single()

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }

  return data
}

export async function getUserStats() {
  const { data, error } = await supabase.from("clerk.users").select("created_at, attrs")

  if (error) {
    throw new Error(`Failed to fetch user stats: ${error.message}`)
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  return {
    total: data?.length || 0,
    lastThirtyDays: data?.filter((user) => new Date(user.created_at) >= thirtyDaysAgo).length || 0,
    lastSevenDays: data?.filter((user) => new Date(user.created_at) >= sevenDaysAgo).length || 0,
    withEmail: data?.filter((user) => user.attrs?.email_addresses?.length > 0).length || 0,
    withPhone: data?.filter((user) => user.attrs?.phone_numbers?.length > 0).length || 0,
  }
}
