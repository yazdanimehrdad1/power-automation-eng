-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_belongsToId_fkey";

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "belongsToId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
