import  prisma  from "@/lib/prisma"
import  UserCard  from "@/components/UserCard";
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Key } from "react";

export default async function Home() {
  {/*const users = await prisma.users.findMany({
    include: {
      user: true,
    },
    take: 5,
  })*/}

  

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Next.js with Prisma Studio</h1>
        <p className="text-muted-foreground mb-6">
          A complete setup showing how to use Prisma with Next.js and access Prisma Studio
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/prismastudio">Admin Panel</Link>
          </Button>
          <Button asChild>
            <Link href="/api/seed" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Seed Database
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
       {/*} <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {users.map((user: { id: Key | null | undefined; type: "admin" | "teacher" | "student" | "parent"; }) => (
              <UserCard key={user.id} type={user.type} />
            ))}
          </div>
        </div>*/}

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">How to Access Prisma Studio</h3>
          <p className="text-muted-foreground mb-4">Prisma Studio runs as a separate process. Use these commands:</p>
          <div className="bg-background p-4 rounded border font-mono text-sm">
            <div className="mb-2"># Start Prisma Studio</div>
            <div className="text-blue-600">npx prisma studio</div>
            <div className="mt-4 mb-2"># Or if you have it in package.json scripts</div>
            <div className="text-blue-600">npm run studio</div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">This will open Prisma Studio at http://localhost:5555</p>
        </div>
      </div>
    </div>
  )
}
