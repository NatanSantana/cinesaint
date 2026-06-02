
export class PagamentoSessaoDto {
    idSessao: number
    idAssento: number[]
    valorIngresso: number
    cpfCliente: string

    constructor(idSessao: number, idAssento: number[], valorIngresso: number, cpfCliente: string) {
        this.idSessao = idSessao
        this.idAssento = idAssento
        this.valorIngresso = valorIngresso
        this.cpfCliente = cpfCliente
    }

}