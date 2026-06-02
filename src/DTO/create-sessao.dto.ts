import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { CreateFilmeDto } from "./create-filme.dto";


export class CreateSessaoDto {
    @IsNotEmpty()
    dataSessao: Date

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    idSala: number

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    idFilme: number


    constructor(dataSessao: Date, idSala: number, idFilme: number) {
        this.dataSessao = dataSessao
        this.idSala = idSala
        this.idFilme = idFilme
        
    }

}