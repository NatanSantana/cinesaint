/*
  Warnings:

  - You are about to drop the column `Lancamento` on the `filmes` table. All the data in the column will be lost.
  - Added the required column `lancamento` to the `filmes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filmes" DROP COLUMN "Lancamento",
ADD COLUMN     "lancamento" TIMESTAMP(3) NOT NULL;
