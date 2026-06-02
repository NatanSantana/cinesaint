-- AlterTable
ALTER TABLE "assentos" ALTER COLUMN "statusCadeira" SET DEFAULT 'LIVRE';

-- AlterTable
ALTER TABLE "filmes" ADD COLUMN     "minutosFilme" INTEGER NOT NULL DEFAULT 60;
