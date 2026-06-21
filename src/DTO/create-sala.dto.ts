import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Tiers } from '../enum/tiers.enum';

export class CreateSalaDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numero: number;

  idSala?: number;

  @IsNotEmpty()
  tierSala: Tiers;

  @IsNotEmpty()
  @IsInt()
  @Min(20)
  qtdeLimiteAssentos: number;

  constructor(numero: number, tierSala: Tiers, qtdeLimiteAssentos: number) {
    this.numero = numero;
    this.tierSala = tierSala;
    this.qtdeLimiteAssentos = qtdeLimiteAssentos;
  }
}
