import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Use a placeholder URL at module load so imports don't crash during build.
// The real URL is used at runtime when DATABASE_URL is populated.
const sql = neon(process.env.DATABASE_URL || "postgresql://user:pass@host.neon.tech/neondb");
export const db = drizzle(sql, { schema });
