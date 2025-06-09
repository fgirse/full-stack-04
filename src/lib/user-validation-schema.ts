import { z } from "zod"

export const userSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
    .optional()
    .or(z.literal("")),

  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),

  phone: z
    .string()
    .regex(/^\+?[\d\s\-$$$$]+$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),

  address: z.string().max(200, { message: "Address must be less than 200 characters" }).optional(),

  img: z.string().optional(),

  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),

  birthday: z
    .string()
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age >= 5 && age <= 100
      },
      { message: "Age must be between 5 and 100 years" },
    )
    .optional(),

  sex: z.enum(["MALE", "FEMALE"]).optional(),

  role: z.enum(["admin", "teacher", "student", "parent"], {
    required_error: "Please select a user role",
  }),

  // Role-specific fields
  subjects: z.array(z.string()).optional(),
  gradeId: z.number().optional(),
  classId: z.number().optional(),
  parentId: z.string().optional(),
})

export type UserSchema = z.infer<typeof userSchema>

// Validation schemas for different roles
export const teacherUserSchema = userSchema.extend({
  role: z.literal("teacher"),
  subjects: z.array(z.string()).min(1, { message: "At least one subject is required for teachers" }),
})

export const studentUserSchema = userSchema.extend({
  role: z.literal("student"),
  gradeId: z.number({ required_error: "Grade is required for students" }),
  classId: z.number({ required_error: "Class is required for students" }),
  parentId: z.string().optional(),
})

export const adminUserSchema = userSchema.extend({
  role: z.literal("admin"),
})

export const parentUserSchema = userSchema.extend({
  role: z.literal("parent"),
})
