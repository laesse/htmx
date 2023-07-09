ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "display_name" varchar(64) NOT NULL DEFAULT 'foo';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "display_name" DROP DEFAULT;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username" ON "user" ("username");