/*
  Warnings:

  - You are about to drop the column `vendorProfileid` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vendorProfileid_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "vendorProfileid";

-- RenameForeignKey
ALTER TABLE "ServiceOrder" RENAME CONSTRAINT "ServiceOrder_payment_fkey" TO "ServiceOrder_paymentId_fkey";
