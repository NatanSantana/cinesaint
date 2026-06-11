import { IsNotEmpty } from "class-validator"
import { StatusCadeira } from "../enum/statusCadeira.enum"

export class CreateAssentosDto {

    @IsNotEmpty()
    identificacao: string

    @IsNotEmpty()
    idSala: number
    
    @IsNotEmpty()
    statusCadeira: StatusCadeira

    constructor(identificacao: string, idSala: number, statusCadeira: StatusCadeira) {
        this.identificacao = identificacao
        this.idSala = idSala
        this.statusCadeira = statusCadeira
    }


}