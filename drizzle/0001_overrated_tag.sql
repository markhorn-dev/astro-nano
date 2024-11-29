CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_gifts` (
	`id` integer PRIMARY KEY NOT NULL,
	`date_added` text DEFAULT '2024-11-28T03:55:17.847Z' NOT NULL,
	`name` text NOT NULL,
	`link` text NOT NULL,
	`assignee` text DEFAULT 'Unassigned' NOT NULL,
	`bought?` text DEFAULT 'No' NOT NULL,
	`notes` text
);
--> statement-breakpoint
INSERT INTO `__new_gifts`("id", "date_added", "name", "link", "assignee", "bought?", "notes") SELECT "id", "date_added", "name", "link", "assignee", "bought?", "notes" FROM `gifts`;--> statement-breakpoint
DROP TABLE `gifts`;--> statement-breakpoint
ALTER TABLE `__new_gifts` RENAME TO `gifts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;