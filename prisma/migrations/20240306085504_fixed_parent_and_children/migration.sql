/*
  Warnings:

  - You are about to drop the `ParentCover` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParentCover" DROP CONSTRAINT "ParentCover_coverId_fkey";

-- DropTable
DROP TABLE "ParentCover";

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
