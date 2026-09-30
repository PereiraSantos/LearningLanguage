import { Injectable, inject, signal } from '@angular/core';

import { EMPTY, Observable, catchError, map, tap } from 'rxjs';

import { TextSmallService } from '../services/text-small.servie';
import { ToastService } from '../services/toast.service';
import { hasItems, normalizeItem } from './annotation.mapper';
import { ANNOTATION_MESSAGES } from './annotation.messages';

/**
 * Facade de estado e casos de uso das anotações.
 *
 * Responsabilidades:
 *  - manter o estado reativo (signals) que a view consome;
 *  - orquestrar o serviço HTTP e os feedbacks de toast;
 *  - concentrar a lógica de negócio (regras que não pertencem à view).
 *
 * Não conhece DOM nem `FormGroup` — por isso é testável isoladamente.
 */
@Injectable()
export class AnnotationFacade {
    private readonly textSmallService = inject(TextSmallService);
    private readonly toastService = inject(ToastService);

    private readonly _items = signal<string[]>([]);

    readonly items = this._items.asReadonly();

    /** Adiciona um texto normalizado à lista pendente. Ignora entradas vazias. */
    addItem(value: string | null | undefined): void {
        const item = normalizeItem(value);
        if (item === null) {
            return;
        }

        this._items.update((prev) => [...prev, item]);
    }

    /** Remove um item pelo seu índice. */
    removeItem(index: number): void {
        this._items.update((prev) => prev.filter((_, i) => i !== index));
    }

    /** Limpa a lista pendente. */
    clear(): void {
        this._items.set([]);
    }

    /**
     * Persiste a lista atual de anotações.
     * Emite `void` e dispara toast de sucesso/erro; limpa o estado em caso de sucesso.
     */
    save(): Observable<void> {
        if (!hasItems(this._items())) {
            this.toastService.show(ANNOTATION_MESSAGES.emptyItemError, 'error');
            return EMPTY;
        }

        return this.textSmallService.saveTextSmall(this._items()).pipe(
            tap(() => {
                this.toastService.show(ANNOTATION_MESSAGES.savedSuccess, 'info');
                this.clear();
            }),
            map(() => undefined),
            catchError(() => {
                this.toastService.show(ANNOTATION_MESSAGES.saveError, 'error');
                return EMPTY;
            }),
        );
    }
}
