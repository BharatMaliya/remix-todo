// drizzle.config.ts (FINAL CORRECTED VERSION)
import type { Config } from "drizzle-kit";

export default {
  schema: "./app/schema.server.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "myuser",
    password: "mypassword",
    database: "tododb",
    ssl: false, // <-- ADD THIS LINE
  },
} satisfies Config;