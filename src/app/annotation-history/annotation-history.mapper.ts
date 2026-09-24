import { TextSmall, TextSmallDTO } from '../entities/text-small';
import { TextSmallInfo } from '../entities/text_small_info';

/**
 * Mapeador puro: transforma o payload bruto da API em uma lista de
 * grupos (`TextSmallInfo`) já agrupados por dia.
 *
 * Sem dependências de Angular — trivial de testar unitariamente.
 *
 * Complexidade O(n): usa um `Map` para acumular os itens por data,
 * preservando a ordem de primeira aparição de cada dia.
 */
export function toTextSmallInfos(dtos: TextSmallDTO[] | null | undefined): TextSmallInfo[] {
    if (!dtos?.length) {
        return [];
    }

    const groups = new Map<string, TextSmall[]>();

    for (const dto of dtos) {
        const textSmall = TextSmall.fromDTO(dto);
        const day = textSmall.day;

        const bucket = groups.get(day);
        if (bucket) {
            bucket.push(textSmall);
        } else {
            groups.set(day, [textSmall]);
        }
    }

    return Array.from(groups, ([day, textSmalls]) => new TextSmallInfo(day, textSmalls));
}
