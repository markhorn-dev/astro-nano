PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_gifts` (
	`id` integer PRIMARY KEY NOT NULL,
	`date_added` text DEFAULT '2024-11-29T15:56:16.161Z' NOT NULL,
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubId_unique` ON `user` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);