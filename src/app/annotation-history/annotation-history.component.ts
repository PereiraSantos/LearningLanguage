import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextSmallService } from '../services/text-small.servie';
import { ToastService } from '../services/toast.service';
import { TextSmall } from '../entities/text-small';
import { TextSmallInfo } from '../entities/text_small_info';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-annotation-history',
    standalone: true,
    imports: [FormsModule, DatePipe, ReactiveFormsModule],
    templateUrl: './annotation-history.component.html',
    styleUrls: ['./annotation-history.component.css']
})
export class AnnotationHistoryComponent implements OnInit {

    private toastService = inject(ToastService);

    constructor(private textSmallService: TextSmallService, public fb: FormBuilder) { }

    items: string[] = [];
    textSmallInfos = signal<TextSmallInfo[]>([]);

    ngOnInit(): void {

        this.getTextSmall();
    }

    getTextSmall() {
        this.textSmallService.getTextSmalls().subscribe({
            next: (response) => {
                this.createListTextSmall(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }

    createListTextSmall(list: any[]) {
        this.textSmallInfos.update(item => []);
        this.items = [];

        this.findDateTextSmall(list);

    }

    findDateTextSmall(list: any[]) {
        if (list.length == 0) return;

        let lastTextSmall = list[list.length - 1];

        let date = lastTextSmall['creation'].split("T")[0];

        let textSmallInfoFilter = list.filter((e) => e['creation'].split("T")[0] == date);

        let textSmalls: TextSmall[] = [];
        let indexText: number[] = [];

        for (const text of textSmallInfoFilter) {
            textSmalls.push(new TextSmall(text['id'], text['value'], text['creation'].split("T")[0]))
            indexText.push(list.findIndex(e => e['creation'].split("T")[0] == date));
        }

        this.textSmallInfos.update(item => [...item, new TextSmallInfo(date, textSmalls)]);

        for (const i of indexText) {
            list.splice(i, 1);
        }

        this.findDateTextSmall(list);
    }
}