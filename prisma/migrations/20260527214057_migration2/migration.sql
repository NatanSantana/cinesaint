/*
  Warnings:

  - You are about to drop the column `assentos` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `salas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numero]` on the table `salas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tierSala` to the `salas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tiers" AS ENUM ('COMUM', 'IMERSIVO', 'DELUX', 'IMAX');

-- AlterTable
ALTER TABLE "salas" DROP COLUMN "assentos",
DROP COLUMN "categoria",
ADD COLUMN     "tierSala" "Tiers" NOT NULL;

-- CreateTable
CREATE TABLE "assentos" (
    "idAssentos" SERIAL NOT NULL,
    "identificacao" TEXT NOT NULL,
    "idSala" INTEGER NOT NULL,

    CONSTRAINT "assentos_pkey" PRIMARY KEY ("idAssentos")
);

-- CreateIndex
CREATE UNIQUE INDEX "assentos_identificacao_key" ON "assentos"("identificacao");

-- CreateIndex
CREATE UNIQUE INDEX "salas_numero_key" ON "salas"("numero");

-- AddForeignKey
ALTER TABLE "assentos" ADD CONSTRAINT "assentos_idSala_fkey" FOREIGN KEY ("idSala") REFERENCES "salas"("idSalas") ON DELETE RESTRICT ON UPDATE CASCADE;
