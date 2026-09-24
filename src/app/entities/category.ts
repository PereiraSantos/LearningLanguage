import { Word, WordDTO } from './word';

export interface CategoryDTO {
    id: number;
    name: string;
    words?: WordDTO[];
}

export class Category {
    constructor(
        public id: number,
        public name: string,
        public words: Word[] = [],
    ) { }

    static fromDTO(dto: CategoryDTO): Category {
        const words = (dto.words ?? []).map(Word.fromDTO);
        return new Category(dto.id, dto.name, words);
    }
}