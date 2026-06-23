/*
  Warnings:

  - Added the required column `Lancamento` to the `filmes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Tiers" ADD VALUE 'ESTUDANTIL';

-- AlterTable
ALTER TABLE "filmes" ADD COLUMN     "Lancamento" TIMESTAMP(3) NOT NULL;
