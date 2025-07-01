"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "../../lib/lib/utils";
import { Users, Settings, BarChart3, Shield } from "lucide-react"

const adminNavItems = [
  {
    href: "/admin",
    label: "dashboard",
    icon: BarChart3,
  },
  {
    href: "/list/users",
    label: "users",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "settings",
    icon: Settings,
  },
  {
    href: "/admin/security",
    label: "security",
    icon: Shield,
  },
]

export function AdminNavigation() {
  const pathname = usePathname()
  const t = useTranslations("AdminNavigation")

  return (
    <nav className="flex space-x-4 mb-6">
      {adminNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{t(item.label)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
