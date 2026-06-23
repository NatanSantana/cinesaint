import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFilmeDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  categoria: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  classificacaoIndicativa: number;

  @IsInt()
  @Min(60)
  minutosFilme: number;

  lancamento: Date;

  constructor(
    nome: string,
    categoria: string,
    classificacaoIndicativa: number,
    minutosFilme: number,
    lancamento: Date,
  ) {
    this.nome = nome;
    this.categoria = categoria;
    this.classificacaoIndicativa = classificacaoIndicativa;
    this.minutosFilme = minutosFilme;
    this.lancamento = lancamento;
  }
}
