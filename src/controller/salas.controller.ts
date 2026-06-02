import { Controller, Get, Post } from "@nestjs/common";
import { SalasService } from "../service/salas.service";
import { CreateSalaDto } from "../DTO/create-sala.dto";
import { Param } from '@nestjs/common';
import { Body } from "@nestjs/common/decorators";


@Controller('/salas')

export class SalasController {
    constructor(private salasService: SalasService) { }


    @Post()
    async cadastrarSala(@Body() sala: CreateSalaDto) {
        return await this.salasService.cadastrarSala(sala);
    }

    @Get()
    async listarSalas() {
        return await this.salasService.listarSalas();
    }

    @Get(':numero')
    async getSalaByNumero(@Param('numero') numero: string) {
        return await this.salasService.buscarSalaPorNumero(+numero);
    }

}