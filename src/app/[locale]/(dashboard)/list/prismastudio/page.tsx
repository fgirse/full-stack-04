import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Eye, Edit, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Prisma Studio Integration</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Manage your database with an embedded Prisma Studio interface
        </p>
        <Link href="prismastudio/studio">
          <Button size="lg" className="gap-2">
            <Database className="w-5 h-5" />
            Open Database Studio
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <Eye className="w-8 h-8 mb-2 text-blue-600" />
            <CardTitle>View Data</CardTitle>
            <CardDescription>Browse and inspect your database tables and records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get a clear overview of all your data with an intuitive interface
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Edit className="w-8 h-8 mb-2 text-green-600" />
            <CardTitle>Edit Records</CardTitle>
            <CardDescription>Create, update, and delete records directly from the interface</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Make quick changes to your data without writing SQL queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="w-8 h-8 mb-2 text-purple-600" />
            <CardTitle>Secure Access</CardTitle>
            <CardDescription>Embedded studio runs securely within your application</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Control access and maintain security within your app's authentication
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
