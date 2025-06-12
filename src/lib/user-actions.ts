"use server"

import { revalidatePath } from "next/cache"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "./prisma"
import type { UserSchema } from "./user-validation-schema"

type ActionState = {
  success: boolean
  error: boolean
  message: string
}

export const createUser = async (prevState: ActionState, data: UserSchema): Promise<ActionState> => {
  try {
    // Validate required fields
    if (!data.username || !data.email || !data.password || !data.firstName || !data.lastName) {
      return {
        success: false,
        error: true,
        message: "Missing required fields",
      }
    }

    // Check if username already exists in Clerk
    try {
      const existingUsers = await clerkClient.users.getUserList({
        username: [data.username],
      })

      if (existingUsers.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "Username already exists",
        }
      }
    } catch (error) {
      console.log("Username check error:", error)
    }

    // Check if email already exists in Clerk
    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [data.email],
      })

      if (existingUsers.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "Email already exists",
        }
      }
    } catch (error) {
      console.log("Email check error:", error)
    }

    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      username: data.username,
      emailAddress: [data.email],
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: data.role,
      },
      privateMetadata: {
        bloodType: data.bloodType,
        address: data.address,
        phone: data.phone,
      },
    })

    // Create user record in database based on role
    switch (data.role) {
      case "teacher":
        await prisma.teacher.create({
          data: {
            id: clerkUser.id, // Use the string value directly
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
            phone: data.phone || "",
            address: data.address || "",
            img: data.img || null,
            bloodType: data.bloodType || "",
            sex: data.sex || "MALE", // Add default or provided value
            birthday: data.birthday || new Date(), // Add default or provided value
          }
        })
        break
      case "student":
        if (!data.parentId) {
          console.log("Parent ID is undefined, skipping parent relation.");
        }
        await prisma.student.create({
          data: {
            id: clerkUser.id,
            username: data.username,
            name: data.firstName,
            surname: data.lastName,
            email: data.email,
            phone: data.phone || "",
            address: data.address || "",
            img: data.img || null,
            bloodType: data.bloodType || "",
            sex: data.sex || "MALE",
            birthday: data.birthday ? new Date(data.birthday) : new Date(),
            ...(data.parentId ? {
              parent: {
                connect: { id: data.parentId },
              },
            } : {}),
            class: data.classId
              ? {
                  connect: { id: Number(data.classId) }, // Convert id to a number
                }
              : {}, // Provide an empty object as a valid default
            grade: {
              create: {
       
                name: "Grade 1", // Adjusted to use a valid property
                level: 1, // Adjusted to use a valid number value
              },
            },
          },
        })
        break
      default:
        return {
          success: false,
          error: true,
          message: "Invalid role",
        }
    }

    // Revalidate the path
    revalidatePath("/users")

    return {
      success: true,
      error: false,
      message: "User created successfully",
    }
  } catch (error) {
    console.log("Error creating user:", error)
    return {
      success: false,
      error: true,
      message: "Error creating user",
    }
  }
}

async function performAction(): Promise<ActionState> {
  const someCondition = true; // Replace with your actual condition
  if (someCondition) {
    return {
      success: true,
      error: false,
      message: "Action succeeded",
    };
  }

  // Default return statement to handle all code paths
  return {
    success: false,
    error: true,
    message: "Action failed",
  };
}
