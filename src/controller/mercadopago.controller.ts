import { Body, Controller, Post, Headers, Query } from "@nestjs/common";
import { SessaoService } from "../service/sessao.service";
import {WebhookSignatureValidator, InvalidWebhookSignatureError} from 'mercadopago'
import 'dotenv/config';
import { UnauthorizedException } from "@nestjs/common";

@Controller("/mercadopago")
export class MercadoPagoController {
    constructor(private sessaoService: SessaoService ) {}


@Post('/webhook')
async handleWebhook(
  @Body() body: any,
  @Headers('x-signature') signature: string,
  @Headers('x-request-id') requestId: string,
  @Query('data.id') dataId: string,
) {
  const secret = process.env.SIGNATURE || "token";

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

  await this.sessaoService.finalizarCompra(body.data.id);
  console.log(body);
}
}

