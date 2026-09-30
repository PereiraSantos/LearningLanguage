import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AnnotationHistoryFacade } from '../annotation-history.facade';
import { TextSmallService } from '../../services/text-small.servie';
import { ToastService } from '../../services/toast.service';
import { TextSmallDTO } from '../../entities/text-small';

describe('AnnotationHistoryFacade', () => {
  const textSmallService = {
    getTextSmalls: vi.fn(),
  };
  const toastService = {
    show: vi.fn(),
  };

  let facade: AnnotationHistoryFacade;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AnnotationHistoryFacade,
        { provide: TextSmallService, useValue: textSmallService },
        { provide: ToastService, useValue: toastService },
      ],
    });
    facade = TestBed.inject(AnnotationHistoryFacade);
  });

  it('should start with an empty history', () => {
    expect(facade.textSmallInfos()).toEqual([]);
  });

  it('should load and group the history by day', () => {
    const dtos: TextSmallDTO[] = [
      { id: 1, value: 'a', creation: '2024-01-01T10:00:00' },
      { id: 2, value: 'b', creation: '2024-01-01T11:00:00' },
      { id: 3, value: 'c', creation: '2024-01-02T10:00:00' },
    ];
    textSmallService.getTextSmalls.mockReturnValue(of(dtos));

    facade.loadHistory();

    expect(facade.textSmallInfos()).toHaveLength(2);
    expect(facade.textSmallInfos()[0].creation).toBe('2024-01-01');
    expect(facade.textSmallInfos()[0].textSmalls).toHaveLength(2);
  });

  it('should show an error toast and keep an empty list when loading fails', () => {
    textSmallService.getTextSmalls.mockReturnValue(throwError(() => new Error('fail')));

    facade.loadHistory();

    expect(toastService.show).toHaveBeenCalledWith(expect.any(String), 'error');
    expect(facade.textSmallInfos()).toEqual([]);
  });
});

