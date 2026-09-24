import { TextSmall } from "./text-small";

/** Agrupamento de anotações por dia. */
export class TextSmallInfo {
    creation: string;
    textSmalls: TextSmall[];

    constructor(creation: string, textSmalls: TextSmall[] = []) {
        this.creation = creation;
        this.textSmalls = textSmalls;
    }
}