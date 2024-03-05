-- CreateEnum
CREATE TYPE "CoverStatus" AS ENUM ('published', 'succeeded', 'processing', 'error', 'deleted');

-- AlterTable
ALTER TABLE "Cover" ADD COLUMN     "status" "CoverStatus" NOT NULL DEFAULT 'published';
