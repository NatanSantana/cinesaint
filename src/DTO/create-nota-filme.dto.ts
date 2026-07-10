import { IsNumber, Max, Min } from "class-validator";

export class CreateNotaFilmeDto {
    idFilme: number

    @Max(5, { message: 'A nota máxima é 5' })
    @Min(1, { message: 'A nota mínima é 1' })
    @IsNumber({ maxDecimalPlaces: 1 })
    nota: number

    @IsNumber()
    idUsuario: number

    constructor(idFilme: number, nota: number, idUsuario: number) {
        this.idFilme = idFilme;
        this.nota = nota;
        this.idUsuario = idUsuario;
    }


}