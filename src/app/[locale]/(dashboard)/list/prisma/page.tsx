import { DatabaseStats } from "@/components/database-stats"
import { PrismaStudioManager } from "@/components/prisma-studio-manager"
import { useTranslations } from "next-intl"

export default function Dashboard() {

  const t = useTranslations("Dashboard");   

  return (
    <><div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-center text-6xl font-bold tracking-tight">
            {t("Title")}
          </h1>
        <p className="text-center text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
        {/* <div className="lg:col-span-2">
      <DatabaseStats />
    </div> */}
        <div className="flex flex-col items-center justify-center">
          <div className="container mx-auto mb-6">
            <PrismaStudioManager />
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
