import { Injectable, BadRequestException } from '@nestjs/common';
import { SessaoRepository } from '../repository/sessao.repository';
import { SalasRepository } from '../repository/salas.repository';
import { IngressosRepository } from '../repository/ingressos.repository';
import { IngressoDto } from '../DTO/create-ingresso.dto';
import { Tiers } from '../enum/tiers.enum';

@Injectable()
export class IngressoService {
  constructor(
    private sessaoRepository: SessaoRepository,
    private salaRepository: SalasRepository,
    private ingressosRepository: IngressosRepository,
  ) {}

  registrarIngresso(ingresso: IngressoDto) {
    if (ingresso.valor <= 0) {
      throw new BadRequestException('O valor do ingresso deve ser positivo');
    }

    if (!Object.values(Tiers).includes(ingresso.tiers)) {
      throw new BadRequestException('O ingresso deve conter um tier válido');
    }

    return this.ingressosRepository.registrarIngresso(ingresso);
  }
}
