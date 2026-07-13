import { Body, Controller, Delete, Query, Post, Get } from "@nestjs/common"
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

    @Get()
    async buscarComentariosByIdFilme(@Query('idFilme') idFilme: number) {
        return await this.ComentariosService.buscarComentariosByIdFilme(idFilme);
    }

    @Get()
    async listarComentariosByIdUser(@Query('idUser') idUser: number) {
        return await this.ComentariosService.listarComentariosByIdUser(idUser);
    }

    @Get()
    async buscarComentariosByUserFilme(@Query('idUser') idUser: number, @Query('idFilme') idFilme: number) {
        return await this.ComentariosService.buscarComentariosByUserFilme(idUser, idFilme);
    }



}