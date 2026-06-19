import { IsNotEmpty } from "class-validator"

export class PagamentoSessaoDto {
    @IsNotEmpty()
    idSessao: number
    
    @IsNotEmpty()
    idAssentos?: number[]

    @IsNotEmpty()
    idSala: number
    
    @IsNotEmpty()
    idFilme: number

    @IsNotEmpty()
    idIngresso: number

    @IsNotEmpty()  
    cpfCliente: string

    constructor(idSessao: number, idSala: number, idFilme: number, idIngresso: number, cpfCliente: string) {
        this.idSessao = idSessao
        this.idSala = idSala
        this.idFilme = idFilme
        this.idIngresso = idIngresso
        this.cpfCliente = cpfCliente
    }

}