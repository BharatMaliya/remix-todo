// app/db.server.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://myuser:mypassword@localhost:5432/tododb",
  ssl: false, 
});

export const db = drizzle(pool);