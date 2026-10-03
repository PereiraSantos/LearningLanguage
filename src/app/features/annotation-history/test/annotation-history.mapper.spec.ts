import { toTextSmallInfos } from '../annotation-history.mapper';
import { TextSmallDTO } from '../../../shared/entities/text-small';

describe('toTextSmallInfos', () => {
  it('deve retornar um array vazio para entrada null, undefined ou vazia', () => {
    expect(toTextSmallInfos(null)).toEqual([]);
    expect(toTextSmallInfos(undefined)).toEqual([]);
    expect(toTextSmallInfos([])).toEqual([]);
  });

  it('deve agrupar os DTOs por dia', () => {
    const dtos: TextSmallDTO[] = [
      { id: 1, value: 'a', creation: '2024-01-01T10:00:00' },
      { id: 2, value: 'b', creation: '2024-01-01T18:30:00' },
      { id: 3, value: 'c', creation: '2024-01-02T09:00:00' },
    ];

    const result = toTextSmallInfos(dtos);

    expect(result).toHaveLength(2);
    expect(result[0].creation).toBe('2024-01-01');
    expect(result[0].textSmalls.map((t) => t.value)).toEqual(['a', 'b']);
    expect(result[1].creation).toBe('2024-01-02');
    expect(result[1].textSmalls.map((t) => t.value)).toEqual(['c']);
  });

  it('deve normalizar a data de criação para apenas a parte do dia', () => {
    const result = toTextSmallInfos([{ id: 1, value: 'a', creation: '2024-05-20T23:59:59' }]);

    expect(result[0].creation).toBe('2024-05-20');
    expect(result[0].textSmalls[0].creation).toBe('2024-05-20');
  });

  it('deve preservar a ordem de primeira aparição dos dias', () => {
    const dtos: TextSmallDTO[] = [
      { id: 1, value: 'a', creation: '2024-03-10T10:00:00' },
      { id: 2, value: 'b', creation: '2024-03-08T10:00:00' },
      { id: 3, value: 'c', creation: '2024-03-10T12:00:00' },
    ];

    const result = toTextSmallInfos(dtos);

    expect(result.map((group) => group.creation)).toEqual(['2024-03-10', '2024-03-08']);
    expect(result[0].textSmalls.map((t) => t.value)).toEqual(['a', 'c']);
  });

  it('não deve mutar o array de entrada original', () => {
    const dtos: TextSmallDTO[] = [
      { id: 1, value: 'a', creation: '2024-01-01T10:00:00' },
      { id: 2, value: 'b', creation: '2024-01-02T10:00:00' },
    ];
    const snapshot = [...dtos];

    toTextSmallInfos(dtos);

    expect(dtos).toEqual(snapshot);
  });
});

