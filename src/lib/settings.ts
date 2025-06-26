// Route access configuration for role-based permissions
export const routeAccessMap: Record<string, string[]> = {
  "/admin": ["admin"],
  "/users": ["admin", "teacher"], // Allow both admin and teacher to access users
  "/users/create": ["admin"], // Only admin can create users
  "/teachers": ["admin"],
  "/students": ["admin", "teacher"],
  "/parents": ["admin", "teacher"],
  "/classes": ["admin", "teacher"],
  "/subjects": ["admin", "teacher"],
  "/lessons": ["admin", "teacher"],
  "/exams": ["admin", "teacher"],
  "/assignments": ["admin", "teacher"],
  "/results": ["admin", "teacher"],
  "/attendance": ["admin", "teacher"],
  "/events": ["admin", "teacher"],
  "/announcements": ["admin", "teacher"],
  "/messages": ["admin", "teacher"],
  "/settings": ["admin"],
}

// filepath: src/lib/settings.ts
export const ITEM_PER_PAGE = 10;


// User roles configuration
export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Role hierarchy for permissions
export const ROLE_HIERARCHY = {
  admin: 4,
  teacher: 3,
  student: 2,
  parent: 1,
} as const

// Check if user has permission to access a route
export function hasRouteAccess(userRole: string, route: string): boolean {
  const allowedRoles = routeAccessMap[route]
  return allowedRoles ? allowedRoles.includes(userRole) : false
}

// Check if user has higher or equal role level
export function hasRoleLevel(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0
  return userLevel >= requiredLevel
}

// Get user permissions based on role
export function getUserPermissions(role: string) {
  const permissions = {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewUsers: false,
    canManageRoles: false,
    canAccessAdmin: false,
  }

  switch (role) {
    case USER_ROLES.ADMIN:
      return {
        ...permissions,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canViewUsers: true,
        canManageRoles: true,
        canAccessAdmin: true,
      }
    case USER_ROLES.TEACHER:
      return {
        ...permissions,
        canViewUsers: true,
        canEditUsers: false, // Teachers can view but not edit users
      }
    default:
      return permissions
  }
}
