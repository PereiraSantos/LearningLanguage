/** Payload bruto devolvido pela API. */
export interface TextSmallDTO {
    id: number;
    value: string;
    creation: string;
}

export class TextSmall {
    id: number;
    value: string;
    creation?: string;

    constructor(id: number, value: string, creation?: string) {
        this.id = id;
        this.value = value;
        this.creation = creation;
    }

    /**
     * Constrói uma entidade a partir do DTO da API.
     * Normaliza `creation` para apenas a data (YYYY-MM-DD).
     */
    static fromDTO(dto: TextSmallDTO): TextSmall {
        return new TextSmall(dto.id, dto.value, TextSmall.toDay(dto.creation));
    }

    /** Extrai a parte "dia" (YYYY-MM-DD) de um timestamp ISO. */
    static toDay(creation: string): string {
        return creation.split('T')[0];
    }

    /** Chave de agrupamento por dia. */
    get day(): string {
        return this.creation ?? TextSmall.toDay('');
    }
}