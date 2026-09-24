import { Category, CategoryDTO } from '../entities/category';

/**
 * Mapeador puro: converte o payload bruto da API em entidades de domínio.
 * Sem dependências de Angular, é trivial de testar unitariamente.
 */
export function toCategories(dtos: CategoryDTO[] | null | undefined): Category[] {
    if (!dtos) {
        return [];
    }
    return dtos.map(Category.fromDTO);
}
