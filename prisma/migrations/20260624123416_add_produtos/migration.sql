-- CreateTable
CREATE TABLE "produtos" (
    "idProduto" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("idProduto")
);

-- CreateTable
CREATE TABLE "produtosComprados" (
    "idProdutoComprado" SERIAL NOT NULL,
    "idProduto" INTEGER NOT NULL,
    "cpf" TEXT,

    CONSTRAINT "produtosComprados_pkey" PRIMARY KEY ("idProdutoComprado")
);

-- CreateIndex
CREATE UNIQUE INDEX "produtos_nome_key" ON "produtos"("nome");

-- AddForeignKey
ALTER TABLE "produtosComprados" ADD CONSTRAINT "produtosComprados_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "produtos"("idProduto") ON DELETE RESTRICT ON UPDATE CASCADE;
