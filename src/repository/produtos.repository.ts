import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProdutoDto } from "../DTO/create-produto.dto";
import { CreateCompraProdutoDto } from "../DTO/create-compra-produto.dto";


@Injectable()
export class ProdutosRepository {
    constructor(private prisma: PrismaService) {}


    async registrarProduto(produto: CreateProdutoDto) {
        return await this.prisma.produtos.create({
            data: produto
        })
    }

    listarProdutosById(id: number[]) {
        return this.prisma.produtos.findMany({
            where: {
                idProduto: {in: id}
            }
        })
    }

    listarProdutos() {
        return this.prisma.produtos.findMany();
    }

    registrarCompra(idProduto: number, cpf: string) {
        return this.prisma.produtosComprados.create({
            data: {
                idProduto: idProduto,
                cpf: cpf
            }
        })
    }



}