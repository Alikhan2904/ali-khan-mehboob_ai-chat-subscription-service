/*
  Warnings:

  - Added the required column `price` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renewalDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "renewalDate" TIMESTAMP(3) NOT NULL;
