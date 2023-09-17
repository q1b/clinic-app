CREATE TABLE IF NOT EXISTS "key" (
	"id" serial PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"image" text,
	"email" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
