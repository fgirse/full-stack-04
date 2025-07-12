import { Hono } from "hono";
import { createPrismaPostgresHttpClient } from "@prisma/studio-core/data/ppg";
import { serializeError } from "@prisma/studio-core/data/bff";
import { cors } from "hono/cors";

const app = new Hono().use("*", cors());

app.post("/studio", async (c) => {
  // 1. Extract the query and custom data from the request
  const { query } = await c.req.json();
  
  // 2. Read DB URL from env vars
  const url = process.env.DATABASE_URL;
  if (!url) {
    return c.json([serializeError(new Error("DATABASE_URL environment variable is not set"))]);
  }
  
  // 3. Execute the query against Prisma Postgres
  const [error, results] = await createPrismaPostgresHttpClient({ url }).execute(query);

  
  

  // 6. Return results or errors
  if (error) {
    return c.json([serializeError(error)]);
  }
  
  return c.json([null, results]);
});