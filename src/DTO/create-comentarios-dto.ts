import { IsNotEmpty } from "class-validator"

export class CreateComentariosFilmes {

    @IsNotEmpty()
    idFilme: number

    @IsNotEmpty()
    idUsuario: number
    
    @IsNotEmpty()
    comentario: string

    constructor(idFilme: number, idUsuario: number, comentario: string) {
        this.idFilme = idFilme
        this.idUsuario = idUsuario
        this.comentario = comentario

    }
}