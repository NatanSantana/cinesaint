import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from '../DTO/create-produto.dto';
import { ProdutosRepository } from '../repository/produtos.repository';
import { client } from '../main';
import { Preference } from 'mercadopago';
import { nanoid } from 'nanoid';
import { CreateCompraProdutoDto } from '../DTO/create-compra-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private produtosRepository: ProdutosRepository) {}

  async registrarProduto(produto: CreateProdutoDto) {
    return await this.produtosRepository.registrarProduto(produto);
  }

  async listarProdutos() {
    return await this.produtosRepository.listarProdutos();
  }

  async comprar(checkout: CreateCompraProdutoDto) {
    let precoTotal = 0;
    const nomeProdutos: string[] = [];

    const produtoAnterior = {
      idProduto: [0],
      nome: '',
      valor: 0,
    };

    for (const i of checkout.idProdutos) {
      if (!produtoAnterior.idProduto.includes(i)) {
        const produto = await this.produtosRepository.listarProdutoById(i);

        if (!produto) {
          throw new NotFoundException('Produto não foi encontrado');
        }

        precoTotal += produto.valor;

        if (!nomeProdutos.includes(produto.nome)) {
          nomeProdutos.push(produto.nome);
        }

        produtoAnterior.idProduto.push(i);
        produtoAnterior.nome = produto.nome;
        produtoAnterior.valor = produto.valor;
      } else {
        precoTotal += produtoAnterior.valor;
      }
    }

    const preference = new Preference(client);

    const gerarPedido = await preference.create({
      body: {
        items: [
          {
            id: nanoid(5),
            title: 'Lanches',
            quantity: 1,
            unit_price: precoTotal,
            description: 'Produtos selecionados: ' + nomeProdutos,
          },
        ],
        metadata: {
          tipoCompra: 'snacks',
          cpf: checkout.cpf,
          idProdutos: checkout.idProdutos,
        },
      },
    });

    const link = {
      link: gerarPedido.init_point,
    };
    return link;
  }

  async finalizarCompraProduto(
    metadata: any,
    status: string | undefined,
    id: number,
  ) {
    if (status == 'approved') {
      for (const i of metadata.id_produtos) {
        await this.produtosRepository.registrarCompra(i, metadata.cpf);
      }

      console.warn('Compra processada: ' + id);
      return;
    } else if (status === 'pending') {
      console.warn('Status da Compra: ' + status);
    } else {
      throw new BadRequestException('A compra falhou');
    }
  }
}
