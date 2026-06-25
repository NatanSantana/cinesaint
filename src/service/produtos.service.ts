import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProdutoDto } from "../DTO/create-produto.dto";
import { ProdutosRepository } from "../repository/produtos.repository";
import { client } from "../main";
import { Preference } from "mercadopago";
import { nanoid } from "nanoid";
import { CreateCompraProdutoDto } from "../DTO/create-compra-produto.dto";

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
        const produtos = await this.produtosRepository.listarProdutosById(checkout.idProduto);

        if (!produtos) {
            throw new NotFoundException("Nenhum produto foi encontrado");
        }

        let precoTotal = 0;
        let nomeProdutos: string[] = [];

        for (let i of produtos) {
            precoTotal += i.valor;
            nomeProdutos.push(i.nome)
        }
        

        const preference = new Preference(client);

        const gerarPedido = await preference.create({
            body: {
                items: [
                    {
                    id: nanoid(5),
                    title: "Lanches",
                    quantity: 1,
                    unit_price: precoTotal,
                    description: "Produtos selecionados: " + nomeProdutos
                    }
                ],
                metadata: {
                    tipoCompra: "snacks",
                    cpf: checkout.cpf,
                    idProdutos: checkout.idProduto
                }
            }
        })

        const link = {
            link: gerarPedido.init_point
        }
        return link;
    }

    async finalizarCompraProduto(metadata: any, status: string | undefined, id: number) {

        if (!metadata.id_produto) {
            console.warn('notificação duplicada')
            return
        }

        if (status === 'approved') {
            for (let i of metadata.id_produtos) {
                this.produtosRepository.registrarCompra(i,metadata.cpf)
            }


            console.warn("Compra processada: " + id)
            return 
        } else if (status === 'pending') {
            console.warn('Status da Compra: ' + status)
        } else {
            throw new BadRequestException('A compra falhou')
        }

        
    }


}