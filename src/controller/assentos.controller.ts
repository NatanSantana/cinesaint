import { Body, Controller, Get, Post } from "@nestjs/common";
import { AssentosService } from "../service/assentos.service";
import { CreateAssentosDto } from "../DTO/create-assentos.dto";
import { Param } from "@nestjs/common/decorators";

@Controller('/assentos')

export class AssentosController {
    constructor(private assentosService: AssentosService) { }

    @Post()
    registrarAssentos(@Body() assento: CreateAssentosDto) {
        return this.assentosService.registrarAssentos(assento   );
    }

    @Get(':idSala')
    assentosByIdSala(@Param('idSala') idSala: string) {
        return this.assentosService.assentosByIdSala(+idSala);
    }


}