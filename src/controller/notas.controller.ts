import { Get, Body, Controller, Delete, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { CreateNotaFilmeDto } from "../DTO/create-nota-filme.dto";
import { NotasService } from "../service/notas.service";
import { JwtAuthGuard } from "../security/jwt-auth.guard";

@Controller("/notas")
export class NotasController {
    constructor(private notasService: NotasService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async adicionarNota(@Body() dto: CreateNotaFilmeDto) {
        return await this.notasService.adicionarNotaFilme(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deletarNota(
        @Query('idFilme', ParseIntPipe) idFilme: number, 
        @Query('idUsuario', ParseIntPipe) idUsuario: number) {
            
        return await this.notasService.retirarNota(idFilme, idUsuario)
    }

    @Get("/media")
    async mediaNotaByFilme(@Query('idFilme') idFilme: number) {
        return await this.notasService.mediaNotaByIdFilme(idFilme);
    }

    @Get("/allByIdFilme")
    async listarByIdFilme(@Query("idFilme") idFilme: number) {
        return await this.notasService.listarNotaByIdFilme(idFilme);
    }


}