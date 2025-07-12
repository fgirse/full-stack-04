"use client"

import { useMemo } from "react"
import { Studio } from "@prisma/studio-core/ui"
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core"
import { createStudioBFFClient } from "@prisma/studio-core/data/bff"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudioPage() {
  const adapter = useMemo(() => {
    // Create a client that points to your backend endpoint
    const executor = createStudioBFFClient({
      url: "/api/studio",
      customHeaders: {
        "Content-Type": "application/json",
      },
    })

    // Create a Postgres adapter with the executor
    const adapter = createPostgresAdapter({ executor })
    return adapter
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Studio</CardTitle>
          <CardDescription>View and edit your database records directly in your application</CardDescription>
        </CardHeader>
      </Card>
console.log('Fetch URL:', '/api/database/stats');
console.log('Base URL:', window.location.origin);
      <div className="border rounded-lg overflow-hidden" style={{ height: "80vh" }}>
        <Studio adapter={adapter} />
      </div>
    </div>
  )
}
