import type { Config } from "drizzle-kit";

import { env } from "./env.mjs";

export default {
  schema: "./drizzle/*",
  out: "./migrations",
  driver: "mysql2",
  dbCredentials: {
    connectionString: env.DATABASE_URL + '?ssl={"rejectUnauthorized":true}',
  },
} satisfies Config;
