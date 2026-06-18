import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { SessaoService } from "../service/sessao.service";
import { CreateSessaoDto } from "../DTO/create-sessao.dto";
import { PagamentoSessaoDto } from "../DTO/pagamento-sessao.dto";
import { Roles } from "../decorator/roles.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { RolesGuard } from "../security/role.guard";


@Controller('/sessao')
export class SessaoController {
    constructor(private sessaoService: SessaoService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/qrcode/:cpf')
    mostrarQrCode(@Param('cpf') cpf: string) {
        return this.sessaoService.mostrarQrCode(cpf);

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/validar-qrcode/:id')
    validarQrCode(@Param('id') id: number) {
        return this.sessaoService.validarIdIngressoComprado(+id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADM')
    criarSessao(@Body() sessao: CreateSessaoDto) {
        return this.sessaoService.criarSessao(sessao);
    }

    @Post('/pagar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER', 'ADM')
    pagarSessao(@Body() checkout: PagamentoSessaoDto) {
        return this.sessaoService.pagamentoSessao(checkout);
    }

    @Get()
    listarAllSessoes() {
        return this.sessaoService.listarAllSessoes();
    }

    @Get('/sessoes-by-filme/:idFilme')
    listarSessoesByIdFilme(@Param('idFilme') idFilme: string) {
        return this.sessaoService.listarSessoesByIdFilme(+idFilme);
    }

    @Post('/encerrar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADM')
    async encerrarSessoes(@Body() body: {idSessao: number[]}) {
        return await this.sessaoService.marcarSessoesFinalizadas(body.idSessao);
    }

    

}