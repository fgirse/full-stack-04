import { DatabaseStats } from "@/components/database-stats"
import { PrismaStudioManager } from "@/components/prisma-studio-manager"

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your school management system database and access Prisma Studio
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DatabaseStats />
        </div>
        <div>
          <PrismaStudioManager />
        </div>
      </div>
    </div>
  )
}
