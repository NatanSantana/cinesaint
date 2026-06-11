import { Injectable } from "@nestjs/common";
import { SessaoRepository } from "../repository/sessao.repository";
import { CreateSessaoDto } from "../DTO/create-sessao.dto";
import { SalasRepository } from "../repository/salas.repository";
import { BadRequestException } from "@nestjs/common/exceptions";
import { FilmeRepository } from "../repository/filme.repository";
import { addDays, format, addMinutes, isAfter, isBefore, isEqual } from 'date-fns';
import { PagamentoSessaoDto } from "../DTO/pagamento-sessao.dto";
import { AssentosRepository } from "../repository/assentos.repository";
import { PagamentoSessaoRepository } from "../repository/pagamento-sessao.repository";
import { IngressosRepository } from "../repository/ingressos.repository";
import { Tiers } from "../enum/tiers.enum";


@Injectable()
export class SessaoService {
    constructor(private sessaoRepository: SessaoRepository, 
        private salaRepository: SalasRepository,
        private filmeRepository: FilmeRepository,
        private assentoRepository: AssentosRepository,
        private pagamentoSessaoRepository: PagamentoSessaoRepository,
        private ingressoRepository: IngressosRepository
    ) { }



    async criarSessao(sessao: CreateSessaoDto) {

        const sala = await this.salaRepository.searchById(sessao.idSala);

        if (!sala) {
            throw new BadRequestException("Sala não encontrada");
        }

        const filme = await this.filmeRepository.searchById(sessao.idFilme);

        if (!filme) {
            throw new BadRequestException("Filme não encontrado");
        }

        if (sessao.dataSessao < new Date()) {
            throw new BadRequestException("Não é possível criar uma sessão com o horário de dias anteriores");
        }

        const sessoes = await this.sessaoRepository.listarSessoesByIdSala(sessao.idSala);

        
        if (sessoes != null) {
            for (const s of sessoes) {
            const dataSessaoExistente = s.dataSessao;
            const dataFimSessaoExistente = addMinutes(dataSessaoExistente, s.filme.minutosFilme);

            // Verificar se a nova sessão começa durante uma sessão existente
            if (isAfter(sessao.dataSessao, dataSessaoExistente) && isBefore(sessao.dataSessao, dataFimSessaoExistente) || isEqual(sessao.dataSessao, dataSessaoExistente)) {
                throw new BadRequestException("Já existe uma sessão nesse horário");
            } 

            const dataFimSessaoNova = addMinutes(sessao.dataSessao, filme.minutosFilme);
            
            // Verificar se a nova sessão termina durante uma sessão existente
            if (isBefore(dataFimSessaoNova, dataFimSessaoExistente) && isAfter(dataFimSessaoNova, dataSessaoExistente) || isEqual(dataFimSessaoNova, dataSessaoExistente)) {
                throw new BadRequestException("Já existe uma sessão nesse horário");
            }


        }
        }

        return this.sessaoRepository.criarSessao(sessao);
    }

    
    async pagamentoSessao(checkout: PagamentoSessaoDto) {
    const sessao = await this.sessaoRepository.buscarSessaoById(checkout.idSessao);
    if (!sessao) throw new BadRequestException("Sessão não encontrada");

    if (isBefore(sessao.dataSessao, new Date()))
        throw new BadRequestException("Sessão já iniciada");

    const [sala, filme, ingresso] = await Promise.all([
        this.salaRepository.searchById(checkout.idSala),
        this.filmeRepository.searchById(checkout.idFilme),
        this.ingressoRepository.buscarIngressoById(checkout.idIngresso),
    ]);

    if (!sala)    throw new BadRequestException("Sala não encontrada");
    if (!filme)   throw new BadRequestException("Filme não encontrado");
    if (!ingresso) throw new BadRequestException("Ingresso não encontrado");

    if (sessao.idFilme !== checkout.idFilme)
        throw new BadRequestException("Filme não corresponde à sessão");

    if (!Object.values(Tiers).includes(ingresso.tiers))
        throw new BadRequestException("Tier do ingresso inválido");

    if (ingresso.tiers !== sala.tierSala)
        throw new BadRequestException("Ingresso incompatível com o tier da sala");

    const assentos = await this.assentoRepository.buscarAssentosLivresById(checkout.idAssentos);

    if (assentos.length !== checkout.idAssentos.length)
        throw new BadRequestException("Um ou mais assentos não estão disponíveis");

    await Promise.all(
    assentos.map(s => this.assentoRepository.atualizarAssentoParaOcupado(s.idAssentos))
    );

    return Promise.all(
        assentos.map(s => this.pagamentoSessaoRepository.registrarPagamentoSessao(checkout, s.idAssentos))
    );
    }

    marcarSessoesFinalizadas(idSala: number[]) {
        


        return this.sessaoRepository.inativarSessoes(idSala);
    }

    listarAllSessoes() {
        return this.sessaoRepository.listarAllSessoes();
    }

    listarSessoesByIdFilme(idFilme: number) {
        return this.sessaoRepository.listarSessoesByIdFilme(idFilme);
    }





}