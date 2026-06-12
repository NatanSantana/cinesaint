/*
  Warnings:

  - The values [OCUPADA] on the enum `StatusCadeira` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusCadeira_new" AS ENUM ('MANUTENCAO', 'LIVRE');
ALTER TABLE "public"."assentos" ALTER COLUMN "statusCadeira" DROP DEFAULT;
ALTER TABLE "assentos" ALTER COLUMN "statusCadeira" TYPE "StatusCadeira_new" USING ("statusCadeira"::text::"StatusCadeira_new");
ALTER TYPE "StatusCadeira" RENAME TO "StatusCadeira_old";
ALTER TYPE "StatusCadeira_new" RENAME TO "StatusCadeira";
DROP TYPE "public"."StatusCadeira_old";
ALTER TABLE "assentos" ALTER COLUMN "statusCadeira" SET DEFAULT 'LIVRE';
COMMIT;

-- CreateTable
CREATE TABLE "assentosOcupados" (
    "idAssentoOcupado" SERIAL NOT NULL,
    "idAssento" INTEGER NOT NULL,
    "idSessao" INTEGER NOT NULL,

    CONSTRAINT "assentosOcupados_pkey" PRIMARY KEY ("idAssentoOcupado")
);

-- AddForeignKey
ALTER TABLE "assentosOcupados" ADD CONSTRAINT "assentosOcupados_idAssento_fkey" FOREIGN KEY ("idAssento") REFERENCES "assentos"("idAssentos") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assentosOcupados" ADD CONSTRAINT "assentosOcupados_idSessao_fkey" FOREIGN KEY ("idSessao") REFERENCES "sessoes"("idSessao") ON DELETE RESTRICT ON UPDATE CASCADE;
