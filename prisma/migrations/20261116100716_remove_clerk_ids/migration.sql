/*
  Warnings:

  - You are about to drop the column `clerkOrgId` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `clerkUserId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "organization_clerkOrgId_key";

-- DropIndex
DROP INDEX "user_clerkUserId_key";

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "clerkOrgId";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "clerkUserId";
