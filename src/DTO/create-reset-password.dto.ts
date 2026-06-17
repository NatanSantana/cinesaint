
export class ResetPasswordDto {
    token: string
    novaSenha: string
    email: string

    constructor(token: string, novaSenha: string, email: string) {
        this.token = token
        this.novaSenha = novaSenha
        this.email = email

    }
}