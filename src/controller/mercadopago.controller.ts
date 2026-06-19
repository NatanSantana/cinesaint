import { Body, Controller, Post } from "@nestjs/common";
import { SessaoService } from "../service/sessao.service";


@Controller("/mercadopago")
export class MercadoPagoController {
    constructor(private sessaoService: SessaoService ) {}


    @Post('/webhook')
async handleWebhook(@Body() body: any) {
    await this.sessaoService.finalizarCompra(body.data.id);
    console.log(body)
  
}


}