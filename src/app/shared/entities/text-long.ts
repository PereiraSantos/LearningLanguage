
export class TextLong {
    id: number;
    value: string;
    creation?: Date;

    constructor(id: number, value: string, creation?: Date) {
        this.id = id;
        this.value = value;
        this.creation = creation;
    }
}