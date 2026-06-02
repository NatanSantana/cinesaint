-- CreateTable
CREATE TABLE "salas" (
    "idSalas" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "assentos" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("idSalas")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "idSessao" SERIAL NOT NULL,
    "dataSessao" TIMESTAMP(3) NOT NULL,
    "idSala" INTEGER NOT NULL,
    "idFilme" INTEGER NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("idSessao")
);

-- CreateTable
CREATE TABLE "filmes" (
    "idFilme" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "classificacaoIndicativa" INTEGER NOT NULL,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("idFilme")
);

-- CreateIndex
CREATE UNIQUE INDEX "filmes_nome_key" ON "filmes"("nome");

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_idSala_fkey" FOREIGN KEY ("idSala") REFERENCES "salas"("idSalas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_idFilme_fkey" FOREIGN KEY ("idFilme") REFERENCES "filmes"("idFilme") ON DELETE RESTRICT ON UPDATE CASCADE;
