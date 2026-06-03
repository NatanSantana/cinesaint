/*
  Warnings:

  - Added the required column `idAssento` to the `ingressosComprados` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingressosComprados" ADD COLUMN     "idAssento" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ingressosComprados" ADD CONSTRAINT "ingressosComprados_idAssento_fkey" FOREIGN KEY ("idAssento") REFERENCES "assentos"("idAssentos") ON DELETE RESTRICT ON UPDATE CASCADE;
