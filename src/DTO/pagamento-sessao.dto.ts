import { IsNotEmpty } from 'class-validator';

interface Ingresso {
  idIngresso: number,
  isEstudante: boolean
}

export class PagamentoSessaoDto {
  @IsNotEmpty()
  idSessao: number;

  @IsNotEmpty()
  idAssentos?: number[];

  @IsNotEmpty()
  idSala: number;

  @IsNotEmpty()
  idFilme: number;

  @IsNotEmpty()
  ingresso: Ingresso[];

  @IsNotEmpty()
  cpfCliente: string;

  

  constructor(
    idSessao: number,
    idSala: number,
    idFilme: number,
    ingresso: Ingresso[],
    cpfCliente: string,
    
  ) {
    this.idSessao = idSessao;
    this.idSala = idSala;
    this.idFilme = idFilme;
    this.ingresso = ingresso;
    this.cpfCliente = cpfCliente;
    
  }
}
