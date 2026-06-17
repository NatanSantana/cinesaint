

export class CreatePasswordResetDto {
    token: string
    email: string
    dataExpiracao: Date

    constructor(token: string, email: string, dataExpiracao: Date) {
        this.token = token
        this.email = email
        this.dataExpiracao = dataExpiracao
    }
}