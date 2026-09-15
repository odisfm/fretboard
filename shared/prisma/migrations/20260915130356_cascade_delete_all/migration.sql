-- DropForeignKey
ALTER TABLE "Scale" DROP CONSTRAINT "Scale_userId_fkey";

-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tuning" DROP CONSTRAINT "Tuning_userId_fkey";

-- AddForeignKey
ALTER TABLE "Tuning" ADD CONSTRAINT "Tuning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scale" ADD CONSTRAINT "Scale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
