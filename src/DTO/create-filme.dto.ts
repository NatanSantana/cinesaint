import { IsInt, IsNotEmpty, IsString, Min } from "class-validator"


export class CreateFilmeDto {
    
    @IsNotEmpty()
    @IsString()
    nome: string

    @IsNotEmpty()
    @IsString() 
    categoria: string

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    classificacaoIndicativa: number

    @IsInt()
    @Min(60)
    minutosFilme: number


    constructor(nome: string, categoria: string, classificacaoIndicativa: number, minutosFilme: number) {
        this.nome = nome
        this.categoria = categoria
        this.classificacaoIndicativa = classificacaoIndicativa
        this.minutosFilme = minutosFilme
    }


}