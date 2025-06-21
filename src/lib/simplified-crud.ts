// Simplified CRUD operations without external dependencies

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "teacher" | "student" | "parent"
  phone?: string
  address?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
  role_data?: any
}

export interface CrudResult<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FilterOptions {
  role?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// Mock data store
const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@school.edu",
    first_name: "System",
    last_name: "Administrator",
    role: "admin",
    phone: "+1-555-0001",
    address: "123 Admin St",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
  },
  {
    id: 2,
    email: "john.teacher@school.edu",
    first_name: "John",
    last_name: "Smith",
    role: "teacher",
    phone: "+1-555-0002",
    address: "456 Teacher Ave",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    role_data: {
      employee_id: "EMP001",
      department: "Mathematics",
      subject: "Algebra",
    },
  },
  {
    id: 3,
    email: "alice.student@school.edu",
    first_name: "Alice",
    last_name: "Brown",
    role: "student",
    phone: "+1-555-0004",
    address: "321 Student Ln",
    created_at: "2024-01-18T11:20:00Z",
    updated_at: "2024-01-18T11:20:00Z",
    role_data: {
      student_id: "STU001",
      grade_level: "9th Grade",
      class_section: "A",
    },
  },
]

export class SimplifiedCrudManager {
  // CREATE
  async createUser(userData: Partial<User> & { password?: string }): Promise<CrudResult<User>> {
    try {
      // Validate required fields
      if (!userData.email || !userData.first_name || !userData.last_name || !userData.role) {
        return { success: false, error: "Missing required fields" }
      }

      // Check for duplicate email
      const existingUser = mockUsers.find((u) => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: "Email already exists" }
      }

      // Create new user
      const newUser: User = {
        id: Math.max(...mockUsers.map((u) => u.id), 0) + 1,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        date_of_birth: userData.date_of_birth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role_data: userData.role_data,
      }

      mockUsers.push(newUser)

      return {
        success: true,
        data: newUser,
        message: "User created successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // READ
  async getUsers(filters: FilterOptions = {}): Promise<CrudResult<{ users: User[]; total: number; page: number }>> {
    try {
      let filteredUsers = [...mockUsers]

      // Apply role filter
      if (filters.role && filters.role !== "all") {
        filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
      }

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.first_name.toLowerCase().includes(searchLower) ||
            user.last_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower),
        )
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredUsers.sort((a, b) => {
          const aValue = a[filters.sortBy as keyof User] || ""
          const bValue = b[filters.sortBy as keyof User] || ""

          if (filters.sortOrder === "desc") {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }

      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit)

      return {
        success: true,
        data: {
          users: paginatedUsers,
          total: filteredUsers.length,
          page,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // UPDATE
  async updateUser(userId: number, updateData: Partial<User>): Promise<CrudResult<User>> {
    try {
      const userIndex = mockUsers.findIndex((u) => u.id === userId)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      // Check for email conflicts
      if (updateData.email && updateData.email !== mockUsers[userIndex].email) {
        const existingUser = mockUsers.find((u) => u.email === updateData.email && u.id !== userId)
        if (existingUser) {
          return { success: false, error: "Email already exists" }
        }
      }

      // Update user
      const updatedUser = {
        ...mockUsers[userIndex],
        ...updateData,
        updated_at: new Date().toISOString(),
      }

      mockUsers[userIndex] = updatedUser

      return {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // DELETE
  async deleteUser(userId: number): Promise<CrudResult<void>> {
    try {
      const userIndex = mockUsers.findIndex((u) => u.id === userId)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      mockUsers.splice(userIndex, 1)

      return {
        success: true,
        message: "User deleted successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // BULK OPERATIONS
  async bulkUpdateUsers(userIds: number[], updateData: Partial<User>): Promise<CrudResult<number>> {
    try {
      let successCount = 0
      const errors: string[] = []

      for (const userId of userIds) {
        const result = await this.updateUser(userId, updateData)
        if (result.success) {
          successCount++
        } else {
          errors.push(`User ${userId}: ${result.error}`)
        }
      }

      return {
        success: successCount > 0,
        data: successCount,
        message: `Updated ${successCount} of ${userIds.length} users`,
        error: errors.length > 0 ? errors.join("; ") : undefined,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async bulkDeleteUsers(userIds: number[]): Promise<CrudResult<number>> {
    try {
      let successCount = 0
      const errors: string[] = []

      for (const userId of userIds) {
        const result = await this.deleteUser(userId)
        if (result.success) {
          successCount++
        } else {
          errors.push(`User ${userId}: ${result.error}`)
        }
      }

      return {
        success: successCount > 0,
        data: successCount,
        message: `Deleted ${successCount} of ${userIds.length} users`,
        error: errors.length > 0 ? errors.join("; ") : undefined,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Export singleton instance
const simplifiedCrudManager = new SimplifiedCrudManager()
export default simplifiedCrudManager
