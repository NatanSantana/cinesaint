import { Controller, Post, Get, Body } from '@nestjs/common';
import { ProdutosService } from '../service/produtos.service';
import { CreateProdutoDto } from '../DTO/create-produto.dto';
import { CreateCompraProdutoDto } from '../DTO/create-compra-produto.dto';

@Controller('/produto')
export class ProdutosController {
  constructor(private produtoService: ProdutosService) {}

  @Post('/registrar')
  async registrarProduto(@Body() produto: CreateProdutoDto) {
    return await this.produtoService.registrarProduto(produto);
  }

  @Get()
  async listarProdutos() {
    return await this.produtoService.listarProdutos();
  }

  @Post('/compra')
  async comprarProduto(@Body() checkout: CreateCompraProdutoDto) {
    return await this.produtoService.comprar(checkout);
  }
}
