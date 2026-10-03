import { TextLong } from "./text-long";

export class TextLongInfo {
    creation: string;
    textLongs: TextLong[];

    constructor(creation: string, textLongs: TextLong[]) {
        this.creation = creation;
        this.textLongs = textLongs;
    }
}