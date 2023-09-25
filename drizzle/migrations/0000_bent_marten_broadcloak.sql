CREATE TABLE `key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text(15) NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`image` text,
	`phone_number` text,
	`bio` text DEFAULT ''
);
