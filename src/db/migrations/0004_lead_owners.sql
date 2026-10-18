ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "owner_id" text REFERENCES "user"("id");
CREATE INDEX IF NOT EXISTS "leads_owner_idx" ON "leads" ("owner_id");
