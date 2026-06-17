import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import "dotenv/config";


@Module({
  imports: [
    MailerModule.forRoot({
  transport: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASST,
    },
  },
  defaults: {
    from: '"Cinema" <noreply@cinema.com>',
  },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}