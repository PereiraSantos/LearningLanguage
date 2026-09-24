import { Injectable, inject, signal } from '@angular/core';

import { Observable, EMPTY, catchError, map, of, tap } from 'rxjs';

import { Category } from '../entities/category';
import { Word } from '../entities/word';
import { CategoryService } from '../services/category.service';
import { WordService } from '../services/word.service';
import { ToastService } from '../services/toast.service';
import { toCategories } from './category.mapper';
import { CATEGORY_MESSAGES } from './category.messages';

/**
 * Facade de estado e casos de uso de categorias.
 *
 * Responsabilidades:
 *  - manter o estado reativo (signals) que a view consome;
 *  - orquestrar os serviços HTTP;
 *  - concentrar a lógica de negócio (regras que não pertencem à view).
 *
 * Não conhece DOM, FormGroup nem modal — por isso é testável isoladamente.
 */
@Injectable()
export class CategoryFacade {
    private readonly categoryService = inject(CategoryService);
    private readonly wordService = inject(WordService);
    private readonly toastService = inject(ToastService);

    private readonly _categories = signal<Category[]>([]);
    private readonly _pendingWords = signal<Word[]>([]);

    readonly categories = this._categories.asReadonly();
    readonly pendingWords = this._pendingWords.asReadonly();

    loadCategories(): void {
        this.categoryService.getCategorys().pipe(
            tap((dtos) => this._categories.set(toCategories(dtos))),
            catchError(() => {
                this.toastService.show(CATEGORY_MESSAGES.loadError, 'error');
                return of([]);
            }),
        ).subscribe();
    }

    createCategory(name: string, pendingWords: Word[]): Observable<void> {
        return this.categoryService.saveCategory(name).pipe(
            tap((created) => {
                this.toastService.show(CATEGORY_MESSAGES.categorySaved, 'info');
                this.saveWords(pendingWords, created.id);
            }),
            map(() => undefined),
            catchError(() => this.handleError()),
        );
    }

    updateCategory(name: string, id: number): Observable<void> {
        return this.categoryService.editCategory(name, id).pipe(
            tap(() => {
                this.toastService.show(CATEGORY_MESSAGES.categoryUpdated, 'info');
                this.loadCategories();
            }),
            map(() => undefined),
            catchError(() => this.handleError()),
        );
    }

    updateWord(name: string, id: number): Observable<void> {
        return this.wordService.editWord(name, id).pipe(
            tap(() => {
                this.toastService.show(CATEGORY_MESSAGES.wordUpdated, 'info');
                this.loadCategories();
            }),
            map(() => undefined),
            catchError(() => this.handleError()),
        );
    }

    saveWords(words: Word[], idCategory: number): void {
        if (words.length === 0) {
            this._pendingWords.set([]);
            this.loadCategories();
            return;
        }

        this.wordService.saveWord(words, idCategory).pipe(
            catchError(() => this.handleError()),
        ).subscribe(() => {
            this._pendingWords.set([]);
            this.loadCategories();
        });
    }

    /* ----- estado temporário (palavras montadas no modal) ----- */

    addPendingWord(name: string): void {
        const newWord = new Word(this._pendingWords().length, name, -1);
        this._pendingWords.update((prev) => [...prev, newWord]);
    }

    removePendingWord(id: number): void {
        this._pendingWords.update((prev) => prev.filter((w) => w.id !== id));
    }

    clearPendingWords(): void {
        this._pendingWords.set([]);
    }

    private handleError(): Observable<never> {
        this.toastService.show(CATEGORY_MESSAGES.saveError, 'error');
        return EMPTY;
    }
}

