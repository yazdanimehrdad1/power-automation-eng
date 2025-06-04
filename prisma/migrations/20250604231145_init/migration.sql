-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetType" TEXT NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
