
export class CreateComentariosFilmes {
    idFilme: number
    idUsuario: number
    comentario: string

    constructor(idFilme: number, idUsuario: number, comentario: string) {
        this.idFilme = idFilme
        this.idUsuario = idUsuario
        this.comentario = comentario

    }
}