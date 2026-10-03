/**
 * Mapeador puro: normaliza a entrada de texto do usuário antes de persistir.
 *
 * Sem dependências de Angular — trivial de testar unitariamente.
 */

/**
 * Normaliza um texto: apara espaços nas extremidades.
 * Retorna `null` quando o resultado é vazio (input inválido).
 */
export function normalizeItem(value: string | null | undefined): string | null {
    if (value == null) {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

/**
 * Normaliza uma lista de textos, descartando entradas vazias.
 * Não muta a entrada original.
 */
export function normalizeItems(values: (string | null | undefined)[] | null | undefined): string[] {
    if (!values?.length) {
        return [];
    }

    return values
        .map(normalizeItem)
        .filter((value): value is string => value !== null);
}

/**
 * Indica se a lista possui conteúdo válido para persistir.
 */
export function hasItems(values: readonly string[] | null | undefined): boolean {
    return !!values && values.length > 0;
}
