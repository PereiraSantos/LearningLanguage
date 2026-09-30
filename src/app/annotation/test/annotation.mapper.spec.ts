import { hasItems, normalizeItem, normalizeItems } from '../annotation.mapper';

describe('normalizeItem', () => {
  it('deve remover os espaços em branco das extremidades', () => {
    expect(normalizeItem('  hello  ')).toBe('hello');
  });

  it('deve retornar null para entrada null, undefined ou em branco', () => {
    expect(normalizeItem(null)).toBeNull();
    expect(normalizeItem(undefined)).toBeNull();
    expect(normalizeItem('')).toBeNull();
    expect(normalizeItem('   ')).toBeNull();
  });
});

describe('normalizeItems', () => {
  it('deve retornar um array vazio para entrada null, undefined ou vazia', () => {
    expect(normalizeItems(null)).toEqual([]);
    expect(normalizeItems(undefined)).toEqual([]);
    expect(normalizeItems([])).toEqual([]);
  });

  it('deve aparar os valores e descartar os inválidos', () => {
    expect(normalizeItems([' a ', '', '  ', 'b'])).toEqual(['a', 'b']);
  });

  it('não deve mutar o array de entrada', () => {
    const input = [' a ', ' b '];
    const snapshot = [...input];

    normalizeItems(input);

    expect(input).toEqual(snapshot);
  });
});

describe('hasItems', () => {
  it('deve ser false para lista null, undefined ou vazia', () => {
    expect(hasItems(null)).toBe(false);
    expect(hasItems(undefined)).toBe(false);
    expect(hasItems([])).toBe(false);
  });

  it('deve ser true quando houver ao menos um item', () => {
    expect(hasItems(['a'])).toBe(true);
  });
});
