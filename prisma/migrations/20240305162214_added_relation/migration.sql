-- CreateTable
CREATE TABLE "ParentCover" (
    "id" TEXT NOT NULL,
    "coverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentCover_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParentCover" ADD CONSTRAINT "ParentCover_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Cover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
