
export class PagamentoSessaoDto {
    idSessao: number
    idAssentos: number[]
    idSala: number
    idFilme: number
    idIngresso: number
    cpfCliente: string

    constructor(idSessao: number, idAssentos: number[], idSala: number, idFilme: number, idIngresso: number, cpfCliente: string) {
        this.idSessao = idSessao
        this.idAssentos = idAssentos
        this.idSala = idSala
        this.idFilme = idFilme
        this.idIngresso = idIngresso
        this.cpfCliente = cpfCliente
    }

}