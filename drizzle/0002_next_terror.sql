CREATE TABLE IF NOT EXISTS "chatbank2_comment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"attitude" boolean DEFAULT true NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chatbank2_reply" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"comment_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reply_to_id" varchar(255),
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chatbank2_post" RENAME COLUMN "created_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "chatbank2_post" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "chatbank2_post" DROP CONSTRAINT "chatbank2_post_created_by_chatbank2_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "created_by_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "chatbank2_post" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "chatbank2_post" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "chatbank2_post" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "chatbank2_post" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "summary" varchar(500);--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "comment_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "status" varchar(31) DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_comment" ADD CONSTRAINT "chatbank2_comment_post_id_chatbank2_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."chatbank2_post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_comment" ADD CONSTRAINT "chatbank2_comment_user_id_chatbank2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chatbank2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_reply" ADD CONSTRAINT "chatbank2_reply_comment_id_chatbank2_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."chatbank2_comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_reply" ADD CONSTRAINT "chatbank2_reply_user_id_chatbank2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chatbank2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbank2_post" ADD CONSTRAINT "chatbank2_post_user_id_chatbank2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chatbank2_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
