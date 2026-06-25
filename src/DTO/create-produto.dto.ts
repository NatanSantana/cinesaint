import { IsNotEmpty, IsPositive, IsString, Max, Min } from "class-validator"

export class CreateProdutoDto {

    @IsString()
    @IsNotEmpty()
    @Min(5)
    @Max(30)
    nome: string

    @IsString()
    @IsNotEmpty()
    categoria: string

    @IsPositive()
    valor: number

    constructor(nome: string, categoria: string, valor: number) {
        this.nome = nome,
        this.categoria = categoria,
        this.valor = valor

    }
}