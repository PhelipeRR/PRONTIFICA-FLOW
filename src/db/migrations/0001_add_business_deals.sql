CREATE TABLE "business_deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"client_name" text NOT NULL,
	"cpf" text,
	"bank" text,
	"bank_category" text DEFAULT 'PRIVADOS' NOT NULL,
	"partner" text,
	"broker_id" uuid,
	"agency_id" uuid,
	"service_owner" text,
	"operations_owner" text,
	"property_value" numeric(14, 2),
	"financing_value" numeric(14, 2),
	"financing_line" text,
	"property_type" text,
	"iq" text,
	"fgts" text,
	"partner_percentage" numeric(7, 4),
	"billable" boolean,
	"stage" text DEFAULT 'FORMULÁRIO' NOT NULL,
	"situation" text DEFAULT 'EM ANÁLISE' NOT NULL,
	"waiting_for" text,
	"notes" text,
	"signature_date" date,
	"deed_date" date,
	"registration_date" date,
	"last_situation_change" timestamp DEFAULT now() NOT NULL,
	"billing_competence" text,
	"billing_order" integer,
	"billing_status" text,
	"portfolio_state" text DEFAULT 'ATIVO' NOT NULL,
	"source" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deal_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"field" text,
	"previous_value" text,
	"new_value" text,
	"changed_by" text,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_deals" ADD CONSTRAINT "business_deals_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_deals" ADD CONSTRAINT "business_deals_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_deals" ADD CONSTRAINT "business_deals_agency_id_real_estate_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."real_estate_agencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deal_history" ADD CONSTRAINT "deal_history_deal_id_business_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."business_deals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "business_deals_state_idx" ON "business_deals" USING btree ("portfolio_state");--> statement-breakpoint
CREATE INDEX "business_deals_bank_idx" ON "business_deals" USING btree ("bank");--> statement-breakpoint
CREATE INDEX "business_deals_stage_idx" ON "business_deals" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "deal_history_deal_idx" ON "deal_history" USING btree ("deal_id");