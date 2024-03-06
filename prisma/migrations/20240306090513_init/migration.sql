-- CreateEnum
CREATE TYPE "CoverStatus" AS ENUM ('published', 'succeeded', 'processing', 'error', 'deleted');

-- CreateTable
CREATE TABLE "Cover" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "CoverStatus" NOT NULL DEFAULT 'published',

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoverToCover" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoverToCover_AB_unique" ON "_CoverToCover"("A", "B");

-- CreateIndex
CREATE INDEX "_CoverToCover_B_index" ON "_CoverToCover"("B");

-- AddForeignKey
ALTER TABLE "_CoverToCover" ADD CONSTRAINT "_CoverToCover_A_fkey" FOREIGN KEY ("A") REFERENCES "Cover"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoverToCover" ADD CONSTRAINT "_CoverToCover_B_fkey" FOREIGN KEY ("B") REFERENCES "Cover"("id") ON DELETE CASCADE ON UPDATE CASCADE;
