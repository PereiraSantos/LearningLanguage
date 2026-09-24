import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AnnotationHistoryFacade } from './annotation-history.facade';

@Component({
    selector: 'app-annotation-history',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './annotation-history.component.html',
    styleUrls: ['./annotation-history.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AnnotationHistoryFacade],
})
export class AnnotationHistoryComponent implements OnInit {
    private readonly facade = inject(AnnotationHistoryFacade);

    readonly textSmallInfos = this.facade.textSmallInfos;
    ngOnInit(): void {
        this.facade.loadHistory();
    }
}
