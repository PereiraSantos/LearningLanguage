import { toCategories } from '../category.mapper';

describe('toCategories', () => {
  it('deve retornar um array vazio para entrada null ou undefined', () => {
    expect(toCategories(null)).toEqual([]);
    expect(toCategories(undefined)).toEqual([]);
  });

  it('deve mapear os DTOs em entidades Category com suas palavras', () => {
    const result = toCategories([
      {
        id: 1,
        name: 'Animais',
        words: [
          { id: 2, name: 'Dog', id_category: 1 },
          { id: 3, name: 'Cat', id_category: 1 },
        ],
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Animais');
    expect(result[0].words.map((w) => w.name)).toEqual(['Dog', 'Cat']);
    expect(result[0].words[0].idCategory).toBe(1);
  });

  it('deve definir uma lista de palavras vazia quando ausente', () => {
    const result = toCategories([{ id: 1, name: 'Sem palavras' }]);
    expect(result[0].words).toEqual([]);
  });
});

