import { Controller, Get, Post } from "@nestjs/common";
import { FilmesService } from "../service/filmes.service";
import { CreateFilmeDto } from "../DTO/create-filme.dto";
import { Body } from "@nestjs/common/decorators";
import { Param, UseGuards } from "@nestjs/common/decorators";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { RolesGuard } from "../security/role.guard";
import { Roles } from "../decorator/roles.decorator";


@Controller('/filmes')
export class FilmeController {
    constructor(private filmesService: FilmesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADM')
    async cadastrarFilme(@Body() filme: CreateFilmeDto) {
        return await this.filmesService.cadastrarFilme(filme);
    }

    @Get()
    async listarFilmes() {
        return await this.filmesService.listarFilmes();
    }


}