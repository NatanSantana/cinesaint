-- CreateEnum
CREATE TYPE "StatusSessao" AS ENUM ('ATIVO', 'INATIVO');

-- AlterTable
ALTER TABLE "sessoes" ADD COLUMN     "statusSessao" "StatusSessao" NOT NULL DEFAULT 'ATIVO';
