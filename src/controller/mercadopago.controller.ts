import { Body, Controller, Post, Headers, Query } from '@nestjs/common';
import { SessaoService } from '../service/sessao.service';
import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
  Payment,
  PaymentRefund,
} from 'mercadopago';
import 'dotenv/config';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
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
    const refundClient = new PaymentRefund(client);
    const valorCompra = result.transaction_amount;
    
    try {
      if (result.metadata.tipo_compra === 'snacks') {
      return await this.produtoService.finalizarCompraProduto(result.metadata, result.status, body.data.id);
    }

    if (result.metadata.tipo_compra === 'ingressos')
      return await this.sessaoService.finalizarCompra(result.metadata, result.status);
    console.log(body);
    } catch (error) {
        console.warn("O registro da compra falhou, PROCESSANDO REEMBOLSO...")
        if (result.transaction_amount === undefined) {
            throw new InternalServerErrorException('Valor da transação não encontrado para reembolso');
        }
        const refund = await refundClient.create({
          payment_id: body.data.id,
          body: {
            amount: result.transaction_amount
          }
        })
        console.warn("Reembolso concedido")
        return refund;
    }
    
  }
}
