import { sql } from "drizzle-orm";
import { db } from "./index";
/** Records created before per-account ownership have no owner; they belong to the oldest administrator. */
export const firstAdminId = sql`(SELECT id FROM "user" WHERE role = 'ADMINISTRADOR' ORDER BY created_at ASC LIMIT 1)`;
export async function ensureLeadOwner(){if(!db)return;await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS owner_id text REFERENCES "user"(id)`);await db.execute(sql`UPDATE leads SET owner_id = ${firstAdminId} WHERE owner_id IS NULL`)}
