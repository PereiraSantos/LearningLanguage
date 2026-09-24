export interface WordDTO {
    id: number;
    name: string;
    id_category: number;
}

export class Word {
    constructor(
        public id: number,
        public name: string,
        public idCategory: number,
    ) { }

    /** Palavra que ainda não foi persistida no backend. */
    get isNew(): boolean {
        return this.idCategory === -1;
    }

    static fromDTO(dto: WordDTO): Word {
        return new Word(dto.id, dto.name, dto.id_category);
    }
}