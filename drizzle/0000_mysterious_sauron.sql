CREATE TABLE `gifts` (
	`id` integer PRIMARY KEY NOT NULL,
	`date_added` text DEFAULT '2024-11-04T13:25:29.250Z' NOT NULL,
	`name` text NOT NULL,
	`link` text NOT NULL,
	`assignee` text DEFAULT 'Unassigned' NOT NULL,
	`bought?` text DEFAULT 'No' NOT NULL,
	`notes` text
);
