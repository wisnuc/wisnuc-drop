# add column

ALTER TABLE `stations` ADD COLUMN `isOnline` INT(11) NULL DEFAULT 0 AFTER `status`;

# drop table
DROP TABLE `station_server`;
