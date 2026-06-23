# 🎬 CineSaint

API REST para gestão e venda de ingressos de cinema, desenvolvida com **NestJS**, **Prisma** e **PostgreSQL**, com checkout integrado ao **Mercado Pago** e geração de **QR Code** para validação de ingressos.

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

## Funcionalidades

- 🎞️ Cadastro de filmes, salas e assentos
- 🗓️ Criação de sessões com validação automática de conflito de horário
- 🔐 Autenticação JWT com controle de acesso por papéis (`ADM` / `USER`)
- 💳 Checkout de ingressos via Mercado Pago (Checkout Pro)
- 🔁 Webhook de pagamento com validação de assinatura HMAC-SHA256 e idempotência
- 📱 Geração de QR Code para validação dos ingressos na entrada
- ✉️ Recuperação de senha por e-mail com token de expiração

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS 11 + TypeScript |
| Banco de dados | PostgreSQL + Prisma ORM |
| Autenticação | Passport + JWT + bcryptjs |
| Pagamentos | SDK `mercadopago` |
| E-mail | `@nestjs-modules/mailer` + Nodemailer |
| QR Code | `qrcode` |
| Testes | Jest + Supertest |

## Pré-requisitos

- Node.js
- PostgreSQL
- Conta no Mercado Pago (Access Token + Webhook Secret)
- Conta de e-mail SMTP (ex.: Gmail com senha de app)

## Instalação

```bash
git clone https://github.com/seu-usuario/cinesaint.git
cd cinesaint
npm install
```

Crie um arquivo `.env` na raiz com as variáveis abaixo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cinesaint"
JWT_SECRET="uma-chave-secreta-bem-grande"
KEY="<access token do Mercado Pago>"
SIGNATURE="<webhook secret do Mercado Pago>"
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="seuemail@gmail.com"
MAIL_PASS="<senha de app>"
IP="<host público, ex.: ngrok>"
```

Aplique as migrations:

```bash
npx prisma migrate deploy
```

## Executando

```bash
# desenvolvimento (watch mode)
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API fica disponível em `http://localhost:3000`.

> Para testar o webhook do Mercado Pago localmente, exponha a porta 3000 com [ngrok](https://ngrok.com/) e cadastre a URL pública em `/mercadopago/webhook` no painel do Mercado Pago.

## Testes

```bash
npm run test        # testes unitários
npm run test:e2e    # testes end-to-end
npm run test:cov    # cobertura
```

## Principais Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Login e emissão de token JWT |
| `POST` | `/user` | Cadastro de usuário |
| `POST` | `/user/esqueci-senha` | Solicita recuperação de senha |
| `GET` / `POST` | `/filmes` | Lista / cadastra filmes |
| `GET` / `POST` | `/salas` | Lista / cadastra salas |
| `GET` / `POST` | `/assentos` | Lista / cadastra assentos |
| `GET` / `POST` | `/sessao` | Lista / cria sessões |
| `POST` | `/sessao/pagar` | Inicia o checkout de compra |
| `GET` | `/sessao/qrcode/:cpf` | Retorna os QR Codes dos ingressos do cliente |
| `POST` | `/mercadopago/webhook` | Webhook de confirmação de pagamento |

## Modelo de Dados (resumo)

```
Salas ─┬─< Assentos
       └─< Sessao >─ Filme
              │
              └─< AssentosOcupados >─ Assentos
              │
              └─< IngressosComprados >─ Ingressos, Salas, Filme, Assentos

Users
ResetPassword
```
