import { defineConfig } from "drizzle-kit";

import { env } from "./env.mjs";

export default defineConfig({
  schema: "./drizzle/*",
  out: "./migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL + '?ssl={"rejectUnauthorized":true}',
  },
  verbose: true,
  strict: true,
});
