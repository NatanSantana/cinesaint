import { Body, Controller, Delete, Query, Post } from "@nestjs/common"
import { ComentariosService } from "../service/comentarios.service";
import { CreateComentariosFilmes } from "../DTO/create-comentarios-dto";


@Controller("/comentarios")
export class ComentariosController {
    constructor(private ComentariosService: ComentariosService) {} 

    @Post()
    async adicionarComentario(@Body() dto: CreateComentariosFilmes) {
        return await this.ComentariosService.registrarComentario(dto); 
    }

    @Delete()
    async deletarComentario(@Query('idFilme') idFilme: number, @Query('idUsuario') idUsuario: number) {
        return await this.ComentariosService.deletarComentario(idFilme, idUsuario)
    }



}