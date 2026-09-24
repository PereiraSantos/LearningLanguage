import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CategoryFacade } from '../category.facade';
import { CategoryService } from '../../services/category.service';
import { WordService } from '../../services/word.service';
import { ToastService } from '../../services/toast.service';
import { Word } from '../../entities/word';

describe('CategoryFacade', () => {
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

  let facade: CategoryFacade;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        CategoryFacade,
        { provide: CategoryService, useValue: categoryService },
        { provide: WordService, useValue: wordService },
        { provide: ToastService, useValue: toastService },
      ],
    });
    facade = TestBed.inject(CategoryFacade);
  });

  it('should load and map categories', () => {
    categoryService.getCategorys.mockReturnValue(
      of([{ id: 1, name: 'Animais', words: [{ id: 2, name: 'Dog', id_category: 1 }] }]),
    );

    facade.loadCategories();

    expect(facade.categories()).toHaveLength(1);
    expect(facade.categories()[0].words[0].name).toBe('Dog');
  });

  it('should show an error toast when loading fails', () => {
    categoryService.getCategorys.mockReturnValue(throwError(() => new Error('fail')));

    facade.loadCategories();

    expect(toastService.show).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('should create a category and then persist its pending words', () => {
    categoryService.saveCategory.mockReturnValue(of({ id: 10, name: 'Nova' }));
    wordService.saveWord.mockReturnValue(of([]));
    const pending = [new Word(0, 'Dog', -1)];

    facade.createCategory('Nova', pending).subscribe();

    expect(categoryService.saveCategory).toHaveBeenCalledWith('Nova');
    expect(wordService.saveWord).toHaveBeenCalledWith(pending, 10);
  });

  it('should not call the word service when there are no pending words', () => {
    categoryService.getCategorys.mockReturnValue(of([]));

    facade.saveWords([], 10);

    expect(wordService.saveWord).not.toHaveBeenCalled();
  });

  it('should manage the pending words list', () => {
    facade.addPendingWord('Dog');
    facade.addPendingWord('Cat');

    expect(facade.pendingWords().map((w) => w.name)).toEqual(['Dog', 'Cat']);

    facade.removePendingWord(0);
    expect(facade.pendingWords().map((w) => w.name)).toEqual(['Cat']);

    facade.clearPendingWords();
    expect(facade.pendingWords()).toHaveLength(0);
  });

  it('should show an error toast when editing fails', () => {
    categoryService.editCategory.mockReturnValue(throwError(() => new Error('fail')));

    facade.updateCategory('X', 1).subscribe();

    expect(toastService.show).toHaveBeenCalledWith(expect.any(String), 'error');
  });
});

