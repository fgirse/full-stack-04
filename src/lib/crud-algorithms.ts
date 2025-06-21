import { clerkClient } from "@clerk/nextjs/server"

// Types for our CRUD operations
export interface User {
  id: number
  clerk_id?: string
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

export class UserCrudManager {
  private sql: any
  private useMockData = false

  constructor() {
    try {
      if (process.env.DATABASE_URL) {
        // Dynamic import to handle missing dependency
        this.initializeDatabase()
      } else {
        this.useMockData = true
        console.warn("Database not configured, using mock data")
      }
    } catch (error) {
      console.warn("Database initialization failed, using mock data:", error)
      this.useMockData = true
    }
  }

  private async initializeDatabase() {
    try {
      const { neon } = await import("@neondatabase/serverless")
      this.sql = neon(process.env.DATABASE_URL!)
    } catch (error) {
      console.warn("Failed to initialize Neon database:", error)
      this.useMockData = true
    }
  }

  // CREATE Algorithm
  async createUser(userData: Partial<User> & { password?: string }): Promise<CrudResult<User>> {
    try {
      // Step 1: Validate required fields
      const validationResult = this.validateUserData(userData, "create")
      if (!validationResult.success) {
        return validationResult
      }

      // Step 2: Check for duplicate email
      const duplicateCheck = await this.checkDuplicateEmail(userData.email!)
      if (!duplicateCheck.success) {
        return duplicateCheck
      }

      // Step 3: Create user in Clerk (if configured)
      let clerkUser = null
      if (process.env.CLERK_SECRET_KEY) {
        const clerkResult = await this.createClerkUser(userData)
        if (!clerkResult.success) {
          return clerkResult
        }
        clerkUser = clerkResult.data
      }

      // Step 4: Create user in database
      const dbResult = await this.createUserInDatabase(userData, clerkUser?.id)
      if (!dbResult.success) {
        // Rollback Clerk user if database fails
        if (clerkUser) {
          await this.rollbackClerkUser(clerkUser.id)
        }
        return dbResult
      }

      // Step 5: Create role-specific data
      const roleResult = await this.createRoleSpecificData(dbResult.data!.id, userData)
      if (!roleResult.success) {
        // Rollback user creation
        await this.rollbackUserCreation(dbResult.data!.id, clerkUser?.id)
        return roleResult
      }

      return {
        success: true,
        data: dbResult.data,
        message: `${userData.role} user created successfully`,
      }
    } catch (error) {
      return this.handleError("createUser", error)
    }
  }

  // READ Algorithm with Advanced Filtering
  async getUsers(filters: FilterOptions = {}): Promise<CrudResult<{ users: User[]; total: number; page: number }>> {
    try {
      if (this.useMockData) {
        return this.getMockUsers(filters)
      }

      // Step 1: Build dynamic query based on filters
      const queryBuilder = this.buildUserQuery(filters)

      // Step 2: Execute count query for pagination
      const countResult = await this.sql`${queryBuilder.countQuery}`
      const total = Number.parseInt(countResult[0]?.count || "0")

      // Step 3: Execute main query with pagination
      const users = await this.sql`${queryBuilder.mainQuery}`

      // Step 4: Enrich users with role-specific data
      const enrichedUsers = await this.enrichUsersWithRoleData(users)

      return {
        success: true,
        data: {
          users: enrichedUsers,
          total,
          page: filters.page || 1,
        },
      }
    } catch (error) {
      return this.handleError("getUsers", error)
    }
  }

  // UPDATE Algorithm
  async updateUser(userId: number, updateData: Partial<User>): Promise<CrudResult<User>> {
    try {
      // Step 1: Validate update data
      const validationResult = this.validateUserData(updateData, "update")
      if (!validationResult.success) {
        return validationResult
      }

      // Step 2: Get current user data
      const currentUser = await this.getUserById(userId)
      if (!currentUser.success) {
        return currentUser
      }

      // Step 3: Check for email conflicts (if email is being updated)
      if (updateData.email && updateData.email !== currentUser.data!.email) {
        const duplicateCheck = await this.checkDuplicateEmail(updateData.email, userId)
        if (!duplicateCheck.success) {
          return duplicateCheck
        }
      }

      // Step 4: Update user in database
      const dbResult = await this.updateUserInDatabase(userId, updateData)
      if (!dbResult.success) {
        return dbResult
      }

      // Step 5: Update Clerk user (if exists)
      if (currentUser.data!.clerk_id) {
        await this.updateClerkUser(currentUser.data!.clerk_id, updateData)
      }

      // Step 6: Update role-specific data
      const roleResult = await this.updateRoleSpecificData(userId, updateData)
      if (!roleResult.success) {
        console.warn("Role data update failed:", roleResult.error)
      }

      return {
        success: true,
        data: dbResult.data,
        message: "User updated successfully",
      }
    } catch (error) {
      return this.handleError("updateUser", error)
    }
  }

  // DELETE Algorithm with Cascade
  async deleteUser(userId: number): Promise<CrudResult<void>> {
    try {
      // Step 1: Get user data for cleanup
      const userResult = await this.getUserById(userId);
      if (!userResult.success) {
        // Map the error result to match CrudResult<void>
        return { success: false, error: userResult.error };
      }

      const user = userResult.data!;

      // Step 2: Delete role-specific data (cascade)
      await this.deleteRoleSpecificData(userId, user.role);

      // Step 3: Delete user from database
      const dbResult = await this.deleteUserFromDatabase(userId);

      return dbResult; // Ensure this matches CrudResult<void>
    } catch (error) {
      return this.handleError("deleteUser", error);
    }
  }

  // BULK Operations Algorithm
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
      return this.handleError("bulkUpdateUsers", error)
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
      return this.handleError("bulkDeleteUsers", error)
    }
  }

  // Helper Methods
  private validateUserData(data: Partial<User>, operation: "create" | "update"): CrudResult {
    if (operation === "create") {
      if (!data.email || !data.first_name || !data.last_name || !data.role) {
        return { success: false, error: "Missing required fields: email, first_name, last_name, role" }
      }
    }

    if (data.email && !this.isValidEmail(data.email)) {
      return { success: false, error: "Invalid email format" }
    }

    if (data.role && !["admin", "teacher", "student", "parent"].includes(data.role)) {
      return { success: false, error: "Invalid role" }
    }

    return { success: true }
  }

  private async checkDuplicateEmail(email: string, excludeUserId?: number): Promise<CrudResult> {
    if (this.useMockData) {
      return { success: true } // Skip for mock data
    }

    try {
      const query = excludeUserId
        ? this.sql`SELECT id FROM users WHERE email = ${email} AND id != ${excludeUserId}`
        : this.sql`SELECT id FROM users WHERE email = ${email}`

      const result = await query

      if (result.length > 0) {
        return { success: false, error: "Email already exists" }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to check email uniqueness" }
    }
  }

  private async createClerkUser(userData: Partial<User>): Promise<CrudResult> {
    try {
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [userData.email!],
        firstName: userData.first_name,
        lastName: userData.last_name,
        publicMetadata: { role: userData.role },
      })

      return { success: true, data: clerkUser }
    } catch (error) {
      return { success: false, error: "Failed to create Clerk user" }
    }
  }

  private async createUserInDatabase(userData: Partial<User>, clerkId?: string): Promise<CrudResult<User>> {
    if (this.useMockData) {
      const mockUser: User = {
        id: Date.now(),
        clerk_id: clerkId,
        email: userData.email!,
        first_name: userData.first_name!,
        last_name: userData.last_name!,
        role: userData.role!,
        phone: userData.phone,
        address: userData.address,
        date_of_birth: userData.date_of_birth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return { success: true, data: mockUser }
    }

    try {
      const result = await this.sql`
        INSERT INTO users (clerk_id, email, first_name, last_name, role, phone, address, date_of_birth)
        VALUES (${clerkId || null}, ${userData.email}, ${userData.first_name}, ${userData.last_name}, 
                ${userData.role}, ${userData.phone || null}, ${userData.address || null}, ${userData.date_of_birth || null})
        RETURNING *
      `

      return { success: true, data: result[0] }
    } catch (error) {
      return { success: false, error: "Failed to create user in database" }
    }
  }

  private async createRoleSpecificData(userId: number, userData: Partial<User>): Promise<CrudResult> {
    if (this.useMockData || !userData.role_data) {
      return { success: true }
    }

    try {
      const roleData = userData.role_data

      switch (userData.role) {
        case "teacher":
          await this.sql`
            INSERT INTO teachers (user_id, employee_id, department, subject, hire_date, qualification, experience_years, salary)
            VALUES (${userId}, ${roleData.employeeId || null}, ${roleData.department || null}, 
                    ${roleData.subject || null}, ${roleData.hireDate || null}, ${roleData.qualification || null},
                    ${roleData.experienceYears || 0}, ${roleData.salary || null})
          `
          break

        case "student":
          await this.sql`
            INSERT INTO students (user_id, student_id, grade_level, class_section, enrollment_date, emergency_contact, medical_info)
            VALUES (${userId}, ${roleData.studentId || null}, ${roleData.gradeLevel || null},
                    ${roleData.classSection || null}, ${roleData.enrollmentDate || null}, 
                    ${roleData.emergencyContact || null}, ${roleData.medicalInfo || null})
          `
          break

        case "parent":
          await this.sql`
            INSERT INTO parents (user_id, occupation, workplace, emergency_contact, relationship_to_student)
            VALUES (${userId}, ${roleData.occupation || null}, ${roleData.workplace || null},
                    ${roleData.emergencyContact || null}, ${roleData.relationshipToStudent || null})
          `
          break
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to create role-specific data" }
    }
  }

  private buildUserQuery(filters: FilterOptions) {
    const { role, search, page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = filters

    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (role && role !== "all") {
      whereClause += ` AND u.role = $${params.length + 1}`
      params.push(role)
    }

    if (search) {
      whereClause += ` AND (u.first_name ILIKE $${params.length + 1} OR u.last_name ILIKE $${params.length + 1} OR u.email ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const offset = (page - 1) * limit
    const orderClause = `ORDER BY u.${sortBy} ${sortOrder.toUpperCase()}`
    const limitClause = `LIMIT ${limit} OFFSET ${offset}`

    const baseQuery = `
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      LEFT JOIN students s ON u.id = s.user_id  
      LEFT JOIN parents p ON u.id = p.user_id
      ${whereClause}
    `

    return {
      countQuery: `SELECT COUNT(*) as count ${baseQuery}`,
      mainQuery: `
        SELECT u.*, 
          CASE 
            WHEN u.role = 'teacher' THEN json_build_object(
              'employee_id', t.employee_id, 'department', t.department, 'subject', t.subject,
              'hire_date', t.hire_date, 'qualification', t.qualification, 'experience_years', t.experience_years,
              'salary', t.salary
            )
            WHEN u.role = 'student' THEN json_build_object(
              'student_id', s.student_id, 'grade_level', s.grade_level, 'class_section', s.class_section,
              'enrollment_date', s.enrollment_date, 'emergency_contact', s.emergency_contact, 'medical_info', s.medical_info
            )
            WHEN u.role = 'parent' THEN json_build_object(
              'occupation', p.occupation, 'workplace', p.workplace, 'emergency_contact', p.emergency_contact,
              'relationship_to_student', p.relationship_to_student
            )
          END as role_data
        ${baseQuery}
        ${orderClause}
        ${limitClause}
      `,
    }
  }

  private async getUserById(userId: number): Promise<CrudResult<User>> {
    if (this.useMockData) {
      return { success: false, error: "Mock data does not support getUserById" }
    }

    try {
      const result = await this.sql`
        SELECT u.*, 
          CASE 
            WHEN u.role = 'teacher' THEN json_build_object(
              'employee_id', t.employee_id, 'department', t.department, 'subject', t.subject,
              'hire_date', t.hire_date, 'qualification', t.qualification, 'experience_years', t.experience_years
            )
            WHEN u.role = 'student' THEN json_build_object(
              'student_id', s.student_id, 'grade_level', s.grade_level, 'class_section', s.class_section,
              'enrollment_date', s.enrollment_date, 'emergency_contact', s.emergency_contact
            )
            WHEN u.role = 'parent' THEN json_build_object(
              'occupation', p.occupation, 'workplace', p.workplace, 'emergency_contact', p.emergency_contact,
              'relationship_to_student', p.relationship_to_student
            )
          END as role_data
        FROM users u
        LEFT JOIN teachers t ON u.id = t.user_id
        LEFT JOIN students s ON u.id = s.user_id
        LEFT JOIN parents p ON u.id = p.user_id
        WHERE u.id = ${userId}
      `

      if (result.length === 0) {
        return { success: false, error: "User not found" }
      }

      return { success: true, data: result[0] }
    } catch (error) {
      return { success: false, error: "Failed to fetch user" }
    }
  }

  private async updateUserInDatabase(userId: number, updateData: Partial<User>): Promise<CrudResult<User>> {
    if (this.useMockData) {
      return { success: true, data: updateData as User }
    }

    try {
      const setClause = []
      const params = []
      let paramIndex = 1

      if (updateData.email) {
        setClause.push(`email = $${paramIndex++}`)
        params.push(updateData.email)
      }
      if (updateData.first_name) {
        setClause.push(`first_name = $${paramIndex++}`)
        params.push(updateData.first_name)
      }
      if (updateData.last_name) {
        setClause.push(`last_name = $${paramIndex++}`)
        params.push(updateData.last_name)
      }
      if (updateData.role) {
        setClause.push(`role = $${paramIndex++}`)
        params.push(updateData.role)
      }
      if (updateData.phone !== undefined) {
        setClause.push(`phone = $${paramIndex++}`)
        params.push(updateData.phone)
      }
      if (updateData.address !== undefined) {
        setClause.push(`address = $${paramIndex++}`)
        params.push(updateData.address)
      }
      if (updateData.date_of_birth !== undefined) {
        setClause.push(`date_of_birth = $${paramIndex++}`)
        params.push(updateData.date_of_birth)
      }

      setClause.push(`updated_at = CURRENT_TIMESTAMP`)
      params.push(userId)

      const result = await this.sql`
        UPDATE users 
        SET ${setClause.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *
      `

      return { success: true, data: result[0] }
    } catch (error) {
      return { success: false, error: "Failed to update user" }
    }
  }

  private async updateRoleSpecificData(userId: number, updateData: Partial<User>): Promise<CrudResult> {
    if (this.useMockData || !updateData.role_data) {
      return { success: true }
    }

    try {
      const roleData = updateData.role_data

      switch (updateData.role) {
        case "teacher":
          await this.sql`
            UPDATE teachers SET
              employee_id = ${roleData.employeeId || null},
              department = ${roleData.department || null},
              subject = ${roleData.subject || null},
              hire_date = ${roleData.hireDate || null},
              qualification = ${roleData.qualification || null},
              experience_years = ${roleData.experienceYears || 0},
              salary = ${roleData.salary || null},
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${userId}
          `
          break

        case "student":
          await this.sql`
            UPDATE students SET
              student_id = ${roleData.studentId || null},
              grade_level = ${roleData.gradeLevel || null},
              class_section = ${roleData.classSection || null},
              enrollment_date = ${roleData.enrollmentDate || null},
              emergency_contact = ${roleData.emergencyContact || null},
              medical_info = ${roleData.medicalInfo || null},
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${userId}
          `
          break

        case "parent":
          await this.sql`
            UPDATE parents SET
              occupation = ${roleData.occupation || null},
              workplace = ${roleData.workplace || null},
              emergency_contact = ${roleData.emergencyContact || null},
              relationship_to_student = ${roleData.relationshipToStudent || null},
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${userId}
          `
          break
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to update role-specific data" }
    }
  }

  private async deleteRoleSpecificData(userId: number, role: string): Promise<CrudResult> {
    if (this.useMockData) {
      return { success: true }
    }

    try {
      switch (role) {
        case "teacher":
          await this.sql`DELETE FROM teachers WHERE user_id = ${userId}`
          break
        case "student":
          await this.sql`DELETE FROM students WHERE user_id = ${userId}`
          break
        case "parent":
          await this.sql`DELETE FROM parents WHERE user_id = ${userId}`
          break
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete role-specific data" }
    }
  }

  private async deleteUserFromDatabase(userId: number): Promise<CrudResult> {
    if (this.useMockData) {
      return { success: true }
    }

    try {
      await this.sql`DELETE FROM users WHERE id = ${userId}`
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete user from database" }
    }
  }

  private async updateClerkUser(clerkId: string, updateData: Partial<User>): Promise<void> {
    try {
      const updatePayload: any = {}

      if (updateData.first_name) updatePayload.firstName = updateData.first_name
      if (updateData.last_name) updatePayload.lastName = updateData.last_name
      if (updateData.role) updatePayload.publicMetadata = { role: updateData.role }

      if (Object.keys(updatePayload).length > 0) {
        await clerkClient.users.updateUser(clerkId, updatePayload)
      }
    } catch (error) {
      console.warn("Failed to update Clerk user:", error)
    }
  }

  private async deleteClerkUser(clerkId: string): Promise<void> {
    try {
      await clerkClient.users.deleteUser(clerkId)
    } catch (error) {
      console.warn("Failed to delete Clerk user:", error)
    }
  }

  private async rollbackClerkUser(clerkId: string): Promise<void> {
    try {
      await clerkClient.users.deleteUser(clerkId)
    } catch (error) {
      console.warn("Failed to rollback Clerk user:", error)
    }
  }

  private async rollbackUserCreation(userId: number, clerkId?: string): Promise<void> {
    try {
      await this.deleteUserFromDatabase(userId)
      if (clerkId) {
        await this.rollbackClerkUser(clerkId)
      }
    } catch (error) {
      console.error("Failed to rollback user creation:", error)
    }
  }

  private async enrichUsersWithRoleData(users: User[]): Promise<User[]> {
    // This is already handled in the SQL query, but can be extended for additional processing
    return users
  }

  private getMockUsers(filters: FilterOptions): CrudResult<{ users: User[]; total: number; page: number }> {
    // Mock implementation for development
    const mockUsers: User[] = [
      {
        id: 1,
        email: "john.doe@example.com",
        first_name: "John",
        last_name: "Doe",
        role: "teacher",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return {
      success: true,
      data: {
        users: mockUsers,
        total: mockUsers.length,
        page: filters.page || 1,
      },
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private handleError(operation: string, error: any): CrudResult {
    console.error(`Error in ${operation}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Export singleton instance - make this a default export
const userCrudManager = new UserCrudManager()
export default userCrudManager
