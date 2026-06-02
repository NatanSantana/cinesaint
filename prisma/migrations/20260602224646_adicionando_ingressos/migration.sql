-- CreateEnum
CREATE TYPE "StatusIngresso" AS ENUM ('VALIDO', 'UTILIZADO');

-- AlterTable
ALTER TABLE "salas" ALTER COLUMN "qtdeLimiteAssentos" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ingressos" (
    "idIngresso" SERIAL NOT NULL,
    "valor" INTEGER NOT NULL,
    "tiers" "Tiers" NOT NULL,

    CONSTRAINT "ingressos_pkey" PRIMARY KEY ("idIngresso")
);

-- CreateTable
CREATE TABLE "ingressosComprados" (
    "idIngressoComprado" SERIAL NOT NULL,
    "idSala" INTEGER NOT NULL,
    "idFilme" INTEGER NOT NULL,
    "idSessao" INTEGER NOT NULL,
    "idIngresso" INTEGER NOT NULL,
    "status" "StatusIngresso" NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "ingressosComprados_pkey" PRIMARY KEY ("idIngressoComprado")
);

-- AddForeignKey
ALTER TABLE "ingressosComprados" ADD CONSTRAINT "ingressosComprados_idSala_fkey" FOREIGN KEY ("idSala") REFERENCES "salas"("idSalas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressosComprados" ADD CONSTRAINT "ingressosComprados_idFilme_fkey" FOREIGN KEY ("idFilme") REFERENCES "filmes"("idFilme") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressosComprados" ADD CONSTRAINT "ingressosComprados_idSessao_fkey" FOREIGN KEY ("idSessao") REFERENCES "sessoes"("idSessao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressosComprados" ADD CONSTRAINT "ingressosComprados_idIngresso_fkey" FOREIGN KEY ("idIngresso") REFERENCES "ingressos"("idIngresso") ON DELETE RESTRICT ON UPDATE CASCADE;
