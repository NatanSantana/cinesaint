/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "notasFilme" (
    "id" SERIAL NOT NULL,
    "idFilme" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,

    CONSTRAINT "notasFilme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentariosFilme" (
    "id" SERIAL NOT NULL,
    "idFilme" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "comentariosFilme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "idUser" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("idUser")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "notasFilme" ADD CONSTRAINT "notasFilme_idFilme_fkey" FOREIGN KEY ("idFilme") REFERENCES "filmes"("idFilme") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notasFilme" ADD CONSTRAINT "notasFilme_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentariosFilme" ADD CONSTRAINT "comentariosFilme_idFilme_fkey" FOREIGN KEY ("idFilme") REFERENCES "filmes"("idFilme") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentariosFilme" ADD CONSTRAINT "comentariosFilme_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
