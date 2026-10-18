import { sql } from "drizzle-orm";
import { db } from "./index";
export async function ensureLeadOwner(){if(db)await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS owner_id text REFERENCES "user"(id)`)}
