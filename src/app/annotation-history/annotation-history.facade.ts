import { Injectable, inject, signal } from '@angular/core';

import { catchError, of, tap } from 'rxjs';

import { TextSmallInfo } from '../entities/text_small_info';
import { TextSmallService } from '../services/text-small.servie';
import { ToastService } from '../services/toast.service';
import { toTextSmallInfos } from './annotation-history.mapper';
import { ANNOTATION_HISTORY_MESSAGES } from './annotation-history.messages';

/**
 * Facade de estado e casos de uso do histórico de anotações.
 *
 * Responsabilidades:
 *  - manter o estado reativo (signals) que a view consome;
 *  - orquestrar o serviço HTTP;
 *  - concentrar a lógica de mapeamento/agrupamento (delegada ao mapper).
 *
 * Não conhece DOM nem template — por isso é testável isoladamente.
 */
@Injectable()
export class AnnotationHistoryFacade {
    private readonly textSmallService = inject(TextSmallService);
    private readonly toastService = inject(ToastService);

    private readonly _textSmallInfos = signal<TextSmallInfo[]>([]);

    readonly textSmallInfos = this._textSmallInfos.asReadonly();

    loadHistory(): void {
        this.textSmallService.getTextSmalls().pipe(
            tap((dtos) => this._textSmallInfos.set(toTextSmallInfos(dtos))),
            catchError(() => {
                this.toastService.show(ANNOTATION_HISTORY_MESSAGES.loadError, 'error');
                this._textSmallInfos.set([]);
                return of([]);
            }),
        ).subscribe();
    }
}
