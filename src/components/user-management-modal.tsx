"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import UserForm from "@/components/forms/UserForm";

interface UserManagementModalProps {
  type: "create" | "update" | "delete"
  userData?: any
  relatedData?: any
  trigger?: React.ReactNode
}

export default function UserManagementModal({ type, userData, relatedData, trigger }: UserManagementModalProps) {
  const [open, setOpen] = useState(false)

  const defaultTrigger = (
    <Button variant={type === "delete" ? "destructive" : type === "update" ? "outline" : "default"} size="sm">
      {type === "create" && <Plus className="h-4 w-4 mr-2" />}
      {type === "update" && <Edit className="h-4 w-4 mr-2" />}
      {type === "delete" && <Trash2 className="h-4 w-4 mr-2" />}
      {type === "create" ? "Add User" : type === "update" ? "Edit" : "Delete"}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {type === "delete" ? (
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive">Delete User</Button>
            </div>
          </div>
        ) : (
          <UserForm type={type} data={userData} onClose={() => setOpen(false)} relatedData={relatedData} />
        )}
      </DialogContent>
    </Dialog>
  )
}
