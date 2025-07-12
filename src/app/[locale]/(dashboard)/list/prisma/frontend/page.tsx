"use client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";                                  

// frontend/index.tsx
import { Studio } from "@prisma/studio-core/ui";
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core";
import { createStudioBFFClient } from "@prisma/studio-core/data/bff";
import { Layout } from "./components/layout";
import { useMemo } from "react";

export default function App() {
  const adapter = useMemo(() => {
    // 1. Create a client that points to your backend endpoint
    const executor = createStudioBFFClient({
      url: "http://localhost:5555/studio",
      customHeaders: {
        "X-Custom-Header": "example-value", // Pass any custom headers
      },
      customPayload: {
        customValue: "example-value" // Pass any custom data
      }
    });

    // 2. Create a Postgres adapter with the executor
    const adapter = createPostgresAdapter({ executor });
    return adapter;
  }, []);

    return (
      <Layout>
        <Studio adapter={adapter} />
      </Layout>
    );
  }