import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from '../DTO/create-produto.dto';

@Injectable()
export class ProdutosRepository {
  constructor(private prisma: PrismaService) {}

  async registrarProduto(produto: CreateProdutoDto) {
    return await this.prisma.produtos.create({
      data: produto,
    });
  }

  listarProdutoById(id: number) {
    return this.prisma.produtos.findUnique({
      select: {
        nome: true,
        valor: true,
      },
      where: {
        idProduto: id,
      },
    });
  }

  listarProdutos() {
    return this.prisma.produtos.findMany();
  }

  async registrarCompra(idProduto: number, cpf: string) {
    return await this.prisma.produtosComprados.create({
      data: {
        idProduto: idProduto,
        cpf: cpf,
      },
    });
  }
}
