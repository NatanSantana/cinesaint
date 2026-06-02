/*
  Warnings:

  - Added the required column `statusCadeira` to the `assentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusCadeira" AS ENUM ('OCUPADA', 'LIVRE');

-- AlterTable
ALTER TABLE "assentos" ADD COLUMN     "statusCadeira" "StatusCadeira" NOT NULL;
