export class CreateCompraProdutoDto {
  idProdutos: number[];

  cpf: string;

  constructor(idProdutos: number[], cpf: string) {
    ((this.idProdutos = idProdutos), (this.cpf = cpf));
  }
}
