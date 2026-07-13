/*
  Warnings:

  - You are about to alter the column `nota` on the `notasFilme` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,1)`.

*/
-- AlterTable
ALTER TABLE "notasFilme" ALTER COLUMN "nota" SET DATA TYPE DECIMAL(3,1);
