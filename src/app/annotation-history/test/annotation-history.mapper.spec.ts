import { toTextSmallInfos } from '../annotation-history.mapper';
import { TextSmallDTO } from '../../entities/text-small';

describe('toTextSmallInfos', () => {
  it('should return an empty array for null, undefined or empty input', () => {
    expect(toTextSmallInfos(null)).toEqual([]);
    expect(toTextSmallInfos(undefined)).toEqual([]);
    expect(toTextSmallInfos([])).toEqual([]);
  });

  it('should group DTOs by day', () => {
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

  it('should normalize the creation date to the day part', () => {
    const result = toTextSmallInfos([{ id: 1, value: 'a', creation: '2024-05-20T23:59:59' }]);

    expect(result[0].creation).toBe('2024-05-20');
    expect(result[0].textSmalls[0].creation).toBe('2024-05-20');
  });

  it('should preserve the first-appearance order of days', () => {
    const dtos: TextSmallDTO[] = [
      { id: 1, value: 'a', creation: '2024-03-10T10:00:00' },
      { id: 2, value: 'b', creation: '2024-03-08T10:00:00' },
      { id: 3, value: 'c', creation: '2024-03-10T12:00:00' },
    ];

    const result = toTextSmallInfos(dtos);

    expect(result.map((group) => group.creation)).toEqual(['2024-03-10', '2024-03-08']);
    expect(result[0].textSmalls.map((t) => t.value)).toEqual(['a', 'c']);
  });

  it('should not mutate the original input array', () => {
    const dtos: TextSmallDTO[] = [
      { id: 1, value: 'a', creation: '2024-01-01T10:00:00' },
      { id: 2, value: 'b', creation: '2024-01-02T10:00:00' },
    ];
    const snapshot = [...dtos];

    toTextSmallInfos(dtos);

    expect(dtos).toEqual(snapshot);
  });
});

