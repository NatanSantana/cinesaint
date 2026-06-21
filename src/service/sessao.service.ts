import { Injectable } from "@nestjs/common";
import { SessaoRepository } from "../repository/sessao.repository";
import { CreateSessaoDto } from "../DTO/create-sessao.dto";
import { SalasRepository } from "../repository/salas.repository";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common/exceptions";
import { FilmeRepository } from "../repository/filme.repository";
import { addDays, format, addMinutes, isAfter, isBefore, isEqual } from 'date-fns';
import { PagamentoSessaoDto } from "../DTO/pagamento-sessao.dto";
import { AssentosRepository } from "../repository/assentos.repository";
import { PagamentoSessaoRepository } from "../repository/pagamento-sessao.repository";
import { IngressosRepository } from "../repository/ingressos.repository";
import { Tiers } from "../enum/tiers.enum";
import { UsersRepository } from "../repository/users.repository";
import { AssentosOcupadosRepository } from "../repository/assentos-ocupados.repository";
import { createAssentosOcupados } from "../DTO/create-assentos-ocupados.dto";
import QRCode from 'qrcode';
import "dotenv/config";
import { Payment, Preference } from 'mercadopago';
import { client } from "../main";
import { nanoid } from "nanoid";



@Injectable()
export class SessaoService {
    constructor(private sessaoRepository: SessaoRepository, 
        private salaRepository: SalasRepository,
        private filmeRepository: FilmeRepository,
        private assentoRepository: AssentosRepository,
        private pagamentoSessaoRepository: PagamentoSessaoRepository,
        private ingressoRepository: IngressosRepository,
        private userRepository: UsersRepository,
        private assentosOcupadosRepository: AssentosOcupadosRepository
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

    const [sala, filme, ingresso, user] = await Promise.all([
        this.salaRepository.searchById(checkout.idSala),
        this.filmeRepository.searchById(checkout.idFilme),
        this.ingressoRepository.buscarIngressoById(checkout.idIngresso),
        this.userRepository.findByCpf(checkout.cpfCliente)
    ]);

    if (!sala)      throw new NotFoundException("Sala não encontrada");
    if (!filme)     throw new NotFoundException("Filme não encontrado");
    if (!ingresso)  throw new NotFoundException("Ingresso não encontrado");
    if (!user)      throw new NotFoundException("Usuário não encontrado, confira o CPF")
    if (!checkout.idAssentos)      throw new NotFoundException("IdAssentos não pode ser null")


    if (sessao.idFilme !== checkout.idFilme)
        throw new BadRequestException("Filme não corresponde à sessão");

    if (!Object.values(Tiers).includes(ingresso.tiers))
        throw new BadRequestException("Tier do ingresso inválido (não existe)");

    if (ingresso.tiers !== sala.tierSala)
        throw new BadRequestException("Ingresso incompatível com o tier da sala");

    // busca o objeto inteiro do assento
    const assentos = await this.assentoRepository.buscarAssentosLivresById(checkout.idAssentos);

    if (assentos.length !== checkout.idAssentos.length)
        throw new BadRequestException("Um ou mais assentos não estão disponíveis");
    ;

    for (let i of assentos) {
        //verifica se os assentos selecionados já existem na tabela de assentos ocupados
        
        if (i.idSala !== checkout.idSala) {
            throw new ConflictException("O Assento não pertence a sala selecionada");
        }


        const isAssentoOcupado = await this.assentosOcupadosRepository.isAssentoOcupado(i.idAssentos, checkout.idSessao)
        if (isAssentoOcupado === true) {
            throw new ConflictException("Todos os assentos selecionados devem estar livres")
        }

    }

    const preference = new Preference(client);

    const gerarPedido = await preference.create({
        body: {
            items: [
                {
                id: nanoid(5),
                title: filme.nome,
                quantity: assentos.length,
                unit_price: ingresso.valor
                }
            ],
            metadata: {
                    idSessao: checkout.idSessao,
                    idAssentos: checkout.idAssentos.join(","),
                    idSala: checkout.idSala,
                    idFilme: checkout.idFilme,
                    idIngresso: checkout.idIngresso,
                    cpfCliente: checkout.cpfCliente
            }
        }
    })

    const pedido = {
        link: gerarPedido.init_point
    }

    return pedido;
    }

    async mostrarQrCode(cpf: string) {
        
        const ingressosComprados = await this.pagamentoSessaoRepository.buscarIngressoByCpf(cpf);

        const ingressosResgatados = await Promise.all(
        ingressosComprados.map((i) =>
        QRCode.toDataURL(
        `http://${process.env.IP}:3000/sessao/validar-qrcode/${i.idIngressoComprado}`
            )
        )
    );
        
        return ingressosResgatados;    
    }

    async finalizarCompra(paymentId: string) {

    const payment = new Payment(client)
    const result = await payment.get({ id: paymentId })

    const metadata = result.metadata

    if (!metadata.id_assentos) {
        console.warn("Notificação duplicada")
        return "Notificação duplicada"
    }

    if (result.status === 'approved') {
        const idAssentos = metadata.id_assentos.split(",").map(Number)

        for (let i of idAssentos) {
            await this.assentosOcupadosRepository.registrarAssento(
                new createAssentosOcupados(i, metadata.id_sessao)
            )

            await this.pagamentoSessaoRepository.registrarPagamentoSessao(
                new PagamentoSessaoDto(
                    metadata.id_sessao,
                    metadata.id_sala,
                    metadata.id_filme,
                    metadata.id_ingresso,
                    metadata.cpf_cliente
                ), i
            )
        }

        return "Pagamento Concluído"
    } else if (result.status === 'pending'){
        console.log("Status Compra: " + result.status)
        console.log("Pagamento pendente");
        
    } 
    
    else {
        throw new BadRequestException("A compra falhou")
    }
}

    async validarIdIngressoComprado(id: number) {
        if (!id) {
            throw new BadRequestException("O id não pode ser null")
        }
        const ingressosComprados = this.pagamentoSessaoRepository.buscarIngressoCompradoById(id);
        if (!ingressosComprados) {
            throw new NotFoundException("Não foi possível encontrar o ingresso informado")
        }

        return ingressosComprados;
    }

    async marcarSessoesFinalizadas(idSessao: number[]) {
        if (!idSessao) {
            throw new BadRequestException("O idSala e o idSessao não podem ser nulos");
        }

        this.assentosOcupadosRepository.excluirAssentosOcupados(idSessao);


        return await this.sessaoRepository.inativarSessoes(idSessao);
    }

    listarAllSessoes() {
        return this.sessaoRepository.listarAllSessoes();
    }

    listarSessoesByIdFilme(idFilme: number) {
        return this.sessaoRepository.listarSessoesByIdFilme(idFilme);
    }





}
