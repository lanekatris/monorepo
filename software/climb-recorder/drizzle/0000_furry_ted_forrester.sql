CREATE TABLE `pending_file` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text,
	`startDate` integer,
	`endDate` integer,
	`status` text,
	`videoLength` integer
);
