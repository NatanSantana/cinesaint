interface Produto {
    idProduto: number
    quantidade: number
}



export class CreateCompraProdutoDto {
    produto: Produto
    
    cpf: string

    constructor(produto: Produto, cpf: string) {
        this.produto = produto,
        this.cpf = cpf
    }
}