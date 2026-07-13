import { Body, Controller, Delete, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CreateNotaFilmeDto } from "../DTO/create-nota-filme.dto";
import { NotasService } from "../service/notas.service";

@Controller("/notas")
export class NotasController {
    constructor(private notasService: NotasService) {}

    @Post()
    async adicionarNota(@Body() dto: CreateNotaFilmeDto) {
        return await this.notasService.adicionarNotaFilme(dto);
    }

    @Delete()
    async deletarNota(
        @Query('idFilme', ParseIntPipe) idFilme: number, 
        @Query('idUsuario', ParseIntPipe) idUsuario: number) {
            
        return await this.notasService.retirarNota(idFilme, idUsuario)
    }


}