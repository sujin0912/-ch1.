-- DropForeignKey
ALTER TABLE "CategorySubscription" DROP CONSTRAINT "CategorySubscription_categoryId_fkey";

-- AlterTable
ALTER TABLE "CategorySubscription" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "CategorySubscription" ADD CONSTRAINT "CategorySubscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
