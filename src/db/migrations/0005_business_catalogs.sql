CREATE TABLE IF NOT EXISTS "business_catalogs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "category" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "color" text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "business_catalogs_category_idx" ON "business_catalogs" USING btree ("category");
