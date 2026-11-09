ALTER TABLE "business_deals" ADD COLUMN IF NOT EXISTS "owner_id" text REFERENCES "user"("id");
CREATE INDEX IF NOT EXISTS "business_deals_owner_idx" ON "business_deals" ("owner_id");
