-- Records imported before per-account ownership go to the oldest administrator.
UPDATE "leads" SET "owner_id" = (SELECT "id" FROM "user" WHERE "role" = 'ADMINISTRADOR' ORDER BY "created_at" ASC LIMIT 1) WHERE "owner_id" IS NULL;
UPDATE "business_deals" SET "owner_id" = (SELECT "id" FROM "user" WHERE "role" = 'ADMINISTRADOR' ORDER BY "created_at" ASC LIMIT 1) WHERE "owner_id" IS NULL;
