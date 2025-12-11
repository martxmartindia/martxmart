-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "annualTurnover" DECIMAL(15,2),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "responseTime" INTEGER,
ADD COLUMN     "serviceAreas" TEXT[],
ADD COLUMN     "specializations" TEXT[],
ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalOrders" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "VendorProfile_status_rating_idx" ON "VendorProfile"("status", "rating");
