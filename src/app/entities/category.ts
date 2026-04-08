import { Word } from "./word";

export class Category {
    id: number;
    name: string;
    words: Word[];

    constructor(id: number, name: string, words: Word[]) {
        this.id = id;
        this.name = name;
        this.words = words
    }
}