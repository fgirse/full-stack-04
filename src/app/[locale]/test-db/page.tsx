// Create: src/app/test-db/page.tsx
import prisma from "@/lib/prisma"

export default async function TestDB() {
  try {
    // Test if we can count users
    const userCount = await prisma.user.count();
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    return (
      <div>
        <h1>Database Test</h1>
        <p>User count: {userCount}</p>
        <p>Tables found: {JSON.stringify(tables)}</p>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Database Error</h1>
        <p>
          Error: {typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error)}
        </p>
      </div>
    );
  }
}