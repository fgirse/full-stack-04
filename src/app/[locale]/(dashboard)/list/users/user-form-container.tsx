"use client"

import { useState } from "react"
import Image from "next/image"
import { UserForm } from "./user-form"
import { DeleteUserDialog } from "./delete-user-dialog"

type FormContainerProps = {
  table: "user"
  type: "create" | "update" | "delete"
  isPreview?: boolean
  // For create and update, data is the user object
  id?: string
  data: any
}
export const UserFormContainer = ({ table, type, data, id }: FormContainerProps) => {
  const [open, setOpen] = useState(false)

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
  const bgColor = type === "create" ? "bg-green-400" : type === "update" ? "bg-sky-200" : "bg-purple-200"

  const Form = () => {
    if (type === "delete" && id) {
      return <DeleteUserDialog id={id} onClose={() => setOpen(false)} />
    }

    if (type === "create" || type === "update") {
      return <UserForm type={type} data={data} onClose={() => setOpen(false)} />
    }

    return null
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {type === "create" && <Image src="/placeholder.svg?height=16&width=16" alt="create" width={16} height={16} />}
        {type === "update" && <Image src="/placeholder.svg?height=16&width=16" alt="update" width={16} height={16} />}
        {type === "delete" && <Image src="/placeholder.svg?height=16&width=16" alt="delete" width={16} height={16} />}
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/placeholder.svg?height=14&width=14" alt="close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
