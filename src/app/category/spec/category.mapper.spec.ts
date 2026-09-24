import { toCategories } from '../category.mapper';

describe('toCategories', () => {
  it('should return an empty array for null or undefined input', () => {
    expect(toCategories(null)).toEqual([]);
    expect(toCategories(undefined)).toEqual([]);
  });

  it('should map DTOs into Category entities with their words', () => {
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

  it('should default to an empty words list when absent', () => {
    const result = toCategories([{ id: 1, name: 'Sem palavras' }]);
    expect(result[0].words).toEqual([]);
  });
});

