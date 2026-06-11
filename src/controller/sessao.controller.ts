import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { SessaoService } from "../service/sessao.service";
import { CreateSessaoDto } from "../DTO/create-sessao.dto";
import { PagamentoSessaoDto } from "../DTO/pagamento-sessao.dto";
import { Roles } from "../decorator/roles.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { RolesGuard } from "../security/role.guard";


@Controller('/sessao')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessaoController {
    constructor(private sessaoService: SessaoService) { }

    @Roles('ADM')
    @Post()
    criarSessao(@Body() sessao: CreateSessaoDto) {
        return this.sessaoService.criarSessao(sessao);
    }

    @Post('/pagar')
    pagarSessao(@Body() checkout: PagamentoSessaoDto) {
        return this.sessaoService.pagamentoSessao(checkout);
    }

    @Get()
    listarAllSessoes() {
        return this.sessaoService.listarAllSessoes();
    }

    @Get(':idFilme')
    listarSessoesByIdFilme(@Param('idFilme') idFilme: string) {
        return this.sessaoService.listarSessoesByIdFilme(+idFilme);
    }

}