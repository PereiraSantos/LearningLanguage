import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoryComponent } from '../category.component';
import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { WordService } from '../../services/word.service';

describe('CategoryComponent', () => {
  const categoryService = {
    getCategorys: vi.fn(),
    saveCategory: vi.fn(),
    editCategory: vi.fn(),
  };
  const wordService = {
    saveWord: vi.fn(),
    editWord: vi.fn(),
  };
  const toastService = {
    show: vi.fn(),
  };

  let fixture: ComponentFixture<CategoryComponent>;
  let component: CategoryComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    categoryService.getCategorys.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: WordService, useValue: wordService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load categories on initialization', () => {
    expect(component).toBeTruthy();
    expect(categoryService.getCategorys).toHaveBeenCalledOnce();
  });

  it('should render the categories returned by the service', () => {
    categoryService.getCategorys.mockReturnValue(
      of([{ id: 1, name: 'Animais', words: [{ id: 2, name: 'Dog', id_category: 1 }] }]),
    );

    component.ngOnInit();

    expect(component.categories()).toHaveLength(1);
    expect(component.categories()[0].name).toBe('Animais');
    expect(component.categories()[0].words[0].name).toBe('Dog');
  });

  it('should add a valid pending word and reset the word form', () => {
    component.wordForm.setValue({ word: 'House' });

    component.addPendingWord();

    expect(component.pendingWords()).toHaveLength(1);
    expect(component.pendingWords()[0].name).toBe('House');
    expect(component.pendingWords()[0].isNew).toBe(true);
    expect(component.wordForm.get('word')?.value).toBeNull();
  });

  it('should not add an invalid pending word', () => {
    component.wordForm.setValue({ word: '' });

    component.addPendingWord();

    expect(component.pendingWords()).toHaveLength(0);
  });

  it('should remove a pending word by id', () => {
    component.wordForm.setValue({ word: 'House' });
    component.addPendingWord();
    component.wordForm.setValue({ word: 'Car' });
    component.addPendingWord();

    component.removePendingWord(0);

    expect(component.pendingWords()).toHaveLength(1);
    expect(component.pendingWords()[0].name).toBe('Car');
  });
});

