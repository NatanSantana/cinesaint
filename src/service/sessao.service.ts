import { Injectable } from '@nestjs/common';
import { SessaoRepository } from '../repository/sessao.repository';
import { CreateSessaoDto } from '../DTO/create-sessao.dto';
import { SalasRepository } from '../repository/salas.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { FilmeRepository } from '../repository/filme.repository';
import {
  addMinutes,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';
import { PagamentoSessaoDto } from '../DTO/pagamento-sessao.dto';
import { AssentosRepository } from '../repository/assentos.repository';
import { PagamentoSessaoRepository } from '../repository/pagamento-sessao.repository';
import { IngressosRepository } from '../repository/ingressos.repository';
import { Tiers } from '../enum/tiers.enum';
import { UsersRepository } from '../repository/users.repository';
import { AssentosOcupadosRepository } from '../repository/assentos-ocupados.repository';
import { createAssentosOcupados } from '../DTO/create-assentos-ocupados.dto';
import QRCode from 'qrcode';
import 'dotenv/config';
import { Preference } from 'mercadopago';
import { client } from '../main';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessaoService {
  constructor(
    private sessaoRepository: SessaoRepository,
    private salaRepository: SalasRepository,
    private filmeRepository: FilmeRepository,
    private assentoRepository: AssentosRepository,
    private pagamentoSessaoRepository: PagamentoSessaoRepository,
    private ingressoRepository: IngressosRepository,
    private userRepository: UsersRepository,
    private assentosOcupadosRepository: AssentosOcupadosRepository,
    private prisma: PrismaService
  ) {}

  async criarSessao(sessao: CreateSessaoDto) {
    const sala = await this.salaRepository.searchById(sessao.idSala);

    if (!sala) {
      throw new BadRequestException('Sala não encontrada');
    }

    const filme = await this.filmeRepository.searchById(sessao.idFilme);

    if (!filme) {
      throw new BadRequestException('Filme não encontrado');
    }

    if (sessao.dataSessao < new Date()) {
      throw new BadRequestException(
        'Não é possível criar uma sessão com o horário de dias anteriores',
      );
    }

    const sessoes = await this.sessaoRepository.listarSessoesByIdSala(
      sessao.idSala,
    );

    if (sessoes != null) {
      for (const s of sessoes) {
        const dataSessaoExistente = s.dataSessao;
        const dataFimSessaoExistente = addMinutes(
          dataSessaoExistente,
          s.filme.minutosFilme,
        );

        // Verificar se a nova sessão começa durante uma sessão existente
        if (
          (isAfter(sessao.dataSessao, dataSessaoExistente) &&
            isBefore(sessao.dataSessao, dataFimSessaoExistente)) ||
          isEqual(sessao.dataSessao, dataSessaoExistente)
        ) {
          throw new BadRequestException('Já existe uma sessão nesse horário');
        }

        const dataFimSessaoNova = addMinutes(
          sessao.dataSessao,
          filme.minutosFilme,
        );

        // Verificar se a nova sessão termina durante uma sessão existente
        if (
          (isBefore(dataFimSessaoNova, dataFimSessaoExistente) &&
            isAfter(dataFimSessaoNova, dataSessaoExistente)) ||
          isEqual(dataFimSessaoNova, dataSessaoExistente)
        ) {
          throw new BadRequestException('Já existe uma sessão nesse horário');
        }
      }
    }

    return this.sessaoRepository.criarSessao(sessao);
  }

  async pagamentoSessao(checkout: PagamentoSessaoDto) {
    let idIngressoVisitado: number = 0;
    let precoIngresso: number =  0;
    let precoTotal: number = 0;


    const sessao = await this.sessaoRepository.buscarSessaoById(
      checkout.idSessao,
    );
    if (!sessao) throw new BadRequestException('Sessão não encontrada');

    if (isBefore(sessao.dataSessao, new Date()))
      throw new BadRequestException('Sessão já iniciada');

    const [sala, filme, user] = await Promise.all([
      this.salaRepository.searchById(checkout.idSala),
      this.filmeRepository.searchById(checkout.idFilme),
      this.userRepository.findByCpf(checkout.cpfCliente),
    ]);

    if (!sala) throw new NotFoundException('Sala não encontrada');
    if (!filme) throw new NotFoundException('Filme não encontrado');
    if (!user)
      throw new NotFoundException('Usuário não encontrado, confira o CPF');

    for (let i of checkout.ingresso) {
      if (i.idIngresso !== idIngressoVisitado) {

        const ingresso = await this.ingressoRepository.buscarIngressoById(i.idIngresso);
        if (!ingresso) throw new NotFoundException('Ingresso não encontrado');

        if (!Object.values(Tiers).includes(ingresso.tiers))
        throw new BadRequestException('Tier do ingresso inválido (não existe)');

        if (ingresso.tiers !== sala.tierSala) 
          throw new BadRequestException('Ingresso incompatível com o tier da sala');

        precoIngresso = ingresso.valor;

        // divide o preço do ingresso na metade se for estudante
        if (i.isEstudante === true) ingresso.valor = ingresso.valor / 2

        idIngressoVisitado = i.idIngresso;
        precoTotal += ingresso.valor 
        
      } else {

          // Se o segundo ingresso for um estudante, vai somar pela metade do valor do ingresso, 
          // se não for, vai somar pelo preço integral
          precoTotal += i.isEstudante === true ? precoIngresso / 2 : precoIngresso;
      }
         
    }

    
    if (!checkout.idAssentos)
      throw new NotFoundException('IdAssentos não pode ser null');

    if (sessao.idFilme !== checkout.idFilme)
      throw new BadRequestException('Filme não corresponde à sessão');


    // busca o objeto inteiro do assento
    const assentos = await this.assentoRepository.buscarAssentosLivresById(
      checkout.idAssentos,
    );

    if (assentos.length !== checkout.idAssentos.length)
      throw new BadRequestException(
        'Um ou mais assentos não estão disponíveis',
      );

    if (assentos.length !== checkout.ingresso.map((i) => i.idIngresso).length) {
      throw new BadRequestException("A quantidade de assentos deve ser a mesma quantidade de ingressos")
    }
    for (const i of assentos) {
      //verifica se os assentos selecionados já existem na tabela de assentos ocupados

      if (i.idSala !== checkout.idSala) {
        throw new ConflictException(
          'O Assento não pertence a sala selecionada',
        );
      }

      const isAssentoOcupado =
        await this.assentosOcupadosRepository.isAssentoOcupado(
          i.idAssentos,
          checkout.idSessao,
        );
      if (isAssentoOcupado === true) {
        throw new ConflictException(
          'Todos os assentos selecionados devem estar livres',
        );
      }
    }

    
    


    const preference = new Preference(client);
    
    const gerarPedido = await preference.create({
      body: {
        items: [
          {
            id: nanoid(5),
            title: filme.nome,
            quantity: 1,
            unit_price: precoTotal,
          },
        ],
        metadata: {
          tipoCompra: 'ingressos',
          idSessao: checkout.idSessao,
          idAssentos: checkout.idAssentos.join(','),
          idSala: checkout.idSala,
          idFilme: checkout.idFilme,
          idIngresso: idIngressoVisitado,
          cpfCliente: checkout.cpfCliente,
        },
      },
    });

    const pedido = {
      link: gerarPedido.init_point,
    };

    return pedido;
  }

  async mostrarQrCode(cpf: string) {
    const ingressosComprados =
      await this.pagamentoSessaoRepository.buscarIngressoByCpf(cpf);

    const ingressosResgatados = await Promise.all(
      ingressosComprados.map((i) =>
        QRCode.toDataURL(
          `http://${process.env.IP}:3000/sessao/validar-qrcode/${i.idIngressoComprado}`,
        ),
      ),
    );

    return ingressosResgatados;
  }

  async finalizarCompra(metadata: any, status: string | undefined) {
  if (status === 'approved') {
    const idAssentos = metadata.id_assentos.split(',').map(Number);

    await this.prisma.$transaction(async (tx) => {
      for (const i of idAssentos) {
        await this.assentosOcupadosRepository.registrarAssentoOcupado(
          tx,
          new createAssentosOcupados(i, metadata.id_sessao),
        );

        await this.pagamentoSessaoRepository.registrarPagamentoSessao(
          tx,
          new PagamentoSessaoDto(
            metadata.id_sessao,
            metadata.id_sala,
            metadata.id_filme,
            metadata.id_ingresso,
            metadata.cpf_cliente,
          ),
          i,
          metadata.id_ingresso,
        );
      }
    });

    console.warn('Pagamento de ingressos Concluído');
    return 'Pagamento Concluído';
  } else if (status === 'pending') {
    console.log('Status Compra: ' + status);
    console.log('Pagamento pendente');
  } else {
    throw new BadRequestException('A compra falhou');
  }
}

  async validarIdIngressoComprado(id: number) {
    if (!id) {
      throw new BadRequestException('O id não pode ser null');
    }
    const ingressosComprados =
      this.pagamentoSessaoRepository.buscarIngressoCompradoById(id);
    if (!ingressosComprados) {
      throw new NotFoundException(
        'Não foi possível encontrar o ingresso informado',
      );
    }

    return ingressosComprados;
  }

  async marcarSessoesFinalizadas(idSessao: number[]) {
    if (!idSessao) {
      throw new BadRequestException(
        'O idSala e o idSessao não podem ser nulos',
      );
    }
    const sessoesInativadas =
      await this.sessaoRepository.inativarSessoes(idSessao);
    if (sessoesInativadas.count === 0) {
      throw new BadRequestException(
        'Não foi possível encontrar sessoes que já acabaram, verifique a DATA',
      );
    }

    const assentosExcluidos =
      await this.assentosOcupadosRepository.excluirAssentosOcupados(idSessao);

    const quantidadeAtingida = { qtde: assentosExcluidos.count };

    return quantidadeAtingida;
  }

  listarAllSessoes() {
    return this.sessaoRepository.listarAllSessoes();
  }

  listarSessoesByIdFilme(idFilme: number) {
    return this.sessaoRepository.listarSessoesByIdFilme(idFilme);
  }
}
