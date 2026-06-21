import { IsNotEmpty } from 'class-validator';
import { Tiers } from '../enum/tiers.enum';

export class IngressoDto {
  @IsNotEmpty()
  valor: number;

  @IsNotEmpty()
  tiers: Tiers;

  constructor(valor: number, tiers: Tiers) {
    this.valor = valor;
    this.tiers = tiers;
  }
}
