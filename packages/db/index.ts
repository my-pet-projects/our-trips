import type { Connection } from "@planetscale/database";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";

export * from "./drizzle/schema";

const globalForMySql = globalThis as unknown as { db: Connection };

const connection =
  globalForMySql.db ||
  connect({
    url: env.DATABASE_URL,
  });

export const db = drizzle(connection, { logger: true });

if (env.NODE_ENV !== "production") globalForMySql.db = connection;
