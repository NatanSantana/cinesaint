import { Body, Controller, Get, Post } from "@nestjs/common";
import { AssentosService } from "../service/assentos.service";
import { CreateAssentosDto } from "../DTO/create-assentos.dto";
import { Param, UseGuards } from "@nestjs/common/decorators";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { RolesGuard } from "../security/role.guard";
import { Roles } from "../decorator/roles.decorator";

@Controller('/assentos')
export class AssentosController {
    constructor(private assentosService: AssentosService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADM')
    registrarAssentos(@Body() assento: CreateAssentosDto) {
        return this.assentosService.registrarAssentos(assento   );
    }

    @Get(':idSala')
    assentosByIdSala(@Param('idSala') idSala: string) {
        return this.assentosService.assentosByIdSala(+idSala);
    }


}