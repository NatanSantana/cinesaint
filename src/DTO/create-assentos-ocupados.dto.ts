import { IsNumber } from 'class-validator';

export class createAssentosOcupados {
  @IsNumber()
  idAssento: number;

  @IsNumber()
  idSessao: number;

  constructor(idAssento: number, idSessao: number) {
    ((this.idAssento = idAssento), (this.idSessao = idSessao));
  }
}
