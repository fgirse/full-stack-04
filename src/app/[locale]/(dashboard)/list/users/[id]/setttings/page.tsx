import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function UserSettingsPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <div className="flex-1 p-4">
      <div className="mb-4">
        <Link
          href={`/users/${id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to User Details
        </Link>
      </div>

      <div className="bg-white p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-4">User Settings</h1>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700">
            This is a placeholder for the user settings page. In a full implementation, this would show:
          </p>
          <ul className="list-disc list-inside mt-2 text-blue-700 text-sm">
            <li>Account security settings</li>
            <li>Notification preferences</li>
            <li>Role management (admin only)</li>
            <li>Access permissions</li>
            <li>Two-factor authentication</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
