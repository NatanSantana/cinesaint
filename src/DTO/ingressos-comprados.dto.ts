import { IsNotEmpty } from 'class-validator';

export class IngressosCompradosDto {
  @IsNotEmpty()
  idSala: number;

  @IsNotEmpty()
  idFilme: number;

  @IsNotEmpty()
  idSessao: number;

  @IsNotEmpty()
  idIngresso: number;

  @IsNotEmpty()
  idAssento: number;

  @IsNotEmpty()
  cpf: string;

  constructor(
    idSala: number,
    idFilme: number,
    idSessao: number,
    idIngresso: number,
    idAssento: number,
    cpf: string,
  ) {
    this.idSala = idSala;
    this.idFilme = idFilme;
    this.idSessao = idSessao;
    this.idIngresso = idIngresso;
    this.idAssento = idAssento;
    this.cpf = cpf;
  }
}
