CREATE TABLE `appointment` (
	`id` text PRIMARY KEY NOT NULL,
	`start_at` text,
	`duration` text DEFAULT '30',
	`user_id` text,
	`osteopath_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`osteopath_id`) REFERENCES `osteopath`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `availability` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text,
	`start_time` text,
	`end_time` text,
	`osteopath_id` text NOT NULL,
	FOREIGN KEY (`osteopath_id`) REFERENCES `osteopath`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `osteopath` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`image` text,
	`phone_number` text,
	`phone_number_verified` integer DEFAULT false,
	`bio` text DEFAULT ''
);
