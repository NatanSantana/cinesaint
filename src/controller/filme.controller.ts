import { Controller, Get, Post } from "@nestjs/common";
import { FilmesService } from "../service/filmes.service";
import { CreateFilmeDto } from "../DTO/create-filme.dto";
import { Body } from "@nestjs/common/decorators";


@Controller('/filmes')
export class FilmeController {
    constructor(private filmesService: FilmesService) { }

    @Post()
    async cadastrarFilme(@Body() filme: CreateFilmeDto) {
        return await this.filmesService.cadastrarFilme(filme);
    }

    @Get()
    async listarFilmes() {
        return await this.filmesService.listarFilmes();
    }


}