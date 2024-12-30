ALTER TABLE "chatbank2_post" ALTER COLUMN "summary" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chatbank2_post" ADD COLUMN "summary_label" varchar(255);