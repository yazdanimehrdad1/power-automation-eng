/*
  Warnings:

  - You are about to drop the column `assetType` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `assetId` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downstreamId` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downstreamName` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upstreamId` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upstreamName` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "assetType",
ADD COLUMN     "assetId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "downstreamId" TEXT NOT NULL,
ADD COLUMN     "downstreamName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "upstreamId" TEXT NOT NULL,
ADD COLUMN     "upstreamName" TEXT NOT NULL,
ADD COLUMN     "video" TEXT NOT NULL;
