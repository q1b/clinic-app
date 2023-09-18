CREATE TABLE IF NOT EXISTS "key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"hashed_password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"username" varchar(55),
	"names" varchar(255),
	"last_names" varchar(255)
);
--> statement-breakpoint
DROP TABLE "auth_key";--> statement-breakpoint
DROP TABLE "user_session";--> statement-breakpoint
DROP TABLE "auth_user";