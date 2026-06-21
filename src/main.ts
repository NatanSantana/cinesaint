import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { MercadoPagoConfig } from 'mercadopago';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, '0.0.0.0');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // lança erro se vier campo extra
      transform: true, // transforma os tipos automaticamente
    }),
  );
}
export const client = new MercadoPagoConfig({
  accessToken: `${process.env.KEY}`,
});
bootstrap();
