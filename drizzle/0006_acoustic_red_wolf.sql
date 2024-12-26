CREATE TABLE IF NOT EXISTS "chatbank2_main" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"business" text,
	"issue" text,
	"reason" text,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "main_id" varchar(255) DEFAULT '1' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_main" ADD CONSTRAINT "chatbank2_main_user_id_chatbank2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chatbank2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_post" ADD CONSTRAINT "chatbank2_post_main_id_chatbank2_main_id_fk" FOREIGN KEY ("main_id") REFERENCES "public"."chatbank2_main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
