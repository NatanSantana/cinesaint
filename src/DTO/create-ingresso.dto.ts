import { Tiers } from "../enum/tiers.enum";

export class IngressoDto {
    valor: number
    tiers: Tiers

    constructor(valor: number, tiers: Tiers) {
        this.valor = valor
        this.tiers = tiers
    }
}