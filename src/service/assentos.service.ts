import { Injectable } from '@nestjs/common';
import { CreateAssentosDto } from '../DTO/create-assentos.dto';
import { AssentosRepository } from '../repository/assentos.repository';
import { SalasRepository } from '../repository/salas.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Injectable()
export class AssentosService {
  constructor(
    private assentosRepository: AssentosRepository,
    private salaRepository: SalasRepository,
  ) {}

  async registrarAssentos(assentos: CreateAssentosDto) {
    const sala = await this.salaRepository.searchById(assentos.idSala);

    if (!sala) {
      throw new BadRequestException('Sala não encontrada');
    }

    const assento = await this.assentosRepository.buscarAssentosByIdentificacao(
      assentos.identificacao,
    );

    if (assento) {
      throw new ConflictException(
        'Já existe um assento com essa identificação',
      );
    }

    const assentosRegistrados =
      await this.assentosRepository.qtdeAssentosByIdSala(assentos.idSala);

    if (assentosRegistrados >= sala.qtdeLimiteAssentos) {
      throw new BadRequestException(
        'Capacidade máxima de assentos atingida para esta sala, não será possível registrar mais assentos',
      );
    }

    return await this.assentosRepository.registrarAssentos(assentos);
  }

  async assentosByIdSala(idSala: number) {
    return await this.assentosRepository.allAssentosByIdSala(idSala);
  }

  async atualizarAssentosManutencao(identificacao: string) {
    if (!identificacao) {
      throw new BadRequestException('A identificação deve ser preenchida');
    }

    identificacao = identificacao.toUpperCase();

    const atualizar =
      await this.assentosRepository.atualizarAssentosComoManutencao(
        identificacao,
      );

    if (!atualizar) {
      throw new NotFoundException(
        'Não foi possível encontrar o assento com essa identificação',
      );
    }

    return 'Assento: ' + identificacao + ' Atualizado para status MANUTENÇÃO';
  }

  async atualizarAssentosComoLivres(identificacao: string) {
    if (!identificacao) {
      throw new BadRequestException('A identificação deve ser preenchida');
    }

    const assentos =
      await this.assentosRepository.atualizarAssentosComoLivre(identificacao);
    if (assentos.count === 0) {
      throw new NotFoundException(
        'Não foi possível encontrar um assento com essa identificação',
      );
    }

    return 'Assento: ' + identificacao + ' Atualizado como LIVRE';
  }
}
