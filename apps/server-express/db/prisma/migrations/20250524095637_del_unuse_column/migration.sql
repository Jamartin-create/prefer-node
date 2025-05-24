/*
  Warnings:

  - You are about to drop the column `provider_user_id` on the `UsersIdentities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UsersIdentities` DROP COLUMN `provider_user_id`;
