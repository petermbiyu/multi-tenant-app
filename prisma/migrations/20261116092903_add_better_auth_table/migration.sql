/*
  Warnings:

  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "invitation" DROP CONSTRAINT "invitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "member" DROP CONSTRAINT "member_organizationId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "clerkUserId" DROP NOT NULL;

-- DropTable
DROP TABLE "organizations";

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logo" TEXT,
    "metadata" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_clerkOrgId_key" ON "organization"("clerkOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
