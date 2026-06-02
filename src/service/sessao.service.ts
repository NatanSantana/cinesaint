import { Injectable } from "@nestjs/common";
import { SessaoRepository } from "../repository/sessao.repository";
import { CreateSessaoDto } from "../DTO/create-sessao.dto";
import { SalasRepository } from "../repository/salas.repository";
import { BadRequestException } from "@nestjs/common/exceptions";
import { FilmeRepository } from "../repository/filme.repository";
import { addDays, format, addMinutes, isAfter, isBefore, isEqual } from 'date-fns';


@Injectable()
export class SessaoService {
    constructor(private sessaoRepository: SessaoRepository, 
        private salaRepository: SalasRepository,
        private filmeRepository: FilmeRepository) { }



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


    async pagamentoSessao() {
        
    }

    listarAllSessoes() {
        return this.sessaoRepository.listarAllSessoes();
    }

    listarSessoesByIdFilme(idFilme: number) {
        return this.sessaoRepository.listarSessoesByIdFilme(idFilme);
    }





}