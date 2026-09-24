import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnnotationHistoryComponent } from '../annotation-history.component';
import { TextSmallService } from '../../services/text-small.servie';
import { ToastService } from '../../services/toast.service';

describe('AnnotationHistoryComponent', () => {
  const textSmallService = {
    getTextSmalls: vi.fn(),
  };
  const toastService = {
    show: vi.fn(),
  };

  let fixture: ComponentFixture<AnnotationHistoryComponent>;
  let component: AnnotationHistoryComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    textSmallService.getTextSmalls.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AnnotationHistoryComponent],
      providers: [
        { provide: TextSmallService, useValue: textSmallService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create and load the history on initialization', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(textSmallService.getTextSmalls).toHaveBeenCalledOnce();
  });

  it('should expose the grouped history returned by the service', () => {
    textSmallService.getTextSmalls.mockReturnValue(
      of([
        { id: 1, value: 'a', creation: '2024-01-01T10:00:00' },
        { id: 2, value: 'b', creation: '2024-01-01T11:00:00' },
      ]),
    );

    fixture.detectChanges();

    expect(component.textSmallInfos()).toHaveLength(1);
    expect(component.textSmallInfos()[0].creation).toBe('2024-01-01');
    expect(component.textSmallInfos()[0].textSmalls.map((t) => t.value)).toEqual(['a', 'b']);
  });

  it('should render one badge per day', () => {
    textSmallService.getTextSmalls.mockReturnValue(
      of([
        { id: 1, value: 'a', creation: '2024-01-01T10:00:00' },
        { id: 2, value: 'b', creation: '2024-01-02T11:00:00' },
      ]),
    );

    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll('.category-badge');
    expect(badges).toHaveLength(2);
  });
});

