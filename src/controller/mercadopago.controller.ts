import { Body, Controller, Post, Headers, Query } from '@nestjs/common';
import { SessaoService } from '../service/sessao.service';
import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
  Payment,
} from 'mercadopago';
import 'dotenv/config';
import { UnauthorizedException } from '@nestjs/common';
import { client } from '../main';
import { ProdutosService } from '../service/produtos.service';

@Controller('/mercadopago')
export class MercadoPagoController {
  constructor(private sessaoService: SessaoService,
    private produtoService: ProdutosService
  ) {}

  @Post('/webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
    @Query('data.id') dataId: string,
  ) {
    const secret = process.env.SIGNATURE || 'token';

    try {
      WebhookSignatureValidator.validate({
        xSignature: signature,
        xRequestId: requestId,
        dataId: dataId,
        secret,
      });
    } catch (err) {
      if (err instanceof InvalidWebhookSignatureError) {
        throw new UnauthorizedException();
      }
      throw err;
    }

    const payment = new Payment(client);
    const result = await payment.get({id: body.data.id});
    

    if (result.metadata.tipo_compra === 'snacks') {
      return await this.produtoService.finalizarCompraProduto(result.metadata, result.status, body.data.id);
    }

    if (result.metadata.tipo_compra === 'ingressos')
      return await this.sessaoService.finalizarCompra(result.metadata, result.status);
    console.log(body);
  }
}
