import { StatusCadeira } from "../enum/statusCadeira.enum"

export class CreateAssentosDto {

    identificacao: string
    idSala: number
    statusCadeira: StatusCadeira

    constructor(identificacao: string, idSala: number, statusCadeira: StatusCadeira) {
        this.identificacao = identificacao
        this.idSala = idSala
        this.statusCadeira = statusCadeira
    }


}