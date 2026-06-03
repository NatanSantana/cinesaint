
export class IngressosCompradosDto {
    idSala: number
    idFilme: number
    idSessao: number
    idIngresso: number
    idAssento: number
    cpf: string

    constructor(idSala: number, idFilme: number, idSessao: number, idIngresso: number, idAssento: number, cpf: string) {
        this.idSala = idSala
        this.idFilme = idFilme
        this.idSessao = idSessao
        this.idIngresso = idIngresso
        this.idAssento = idAssento
        this.cpf = cpf
    }
}