import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextLongService } from '../services/text-long.service';
import { TextSmallService } from '../services/text-small.servie';
import { ToastService } from '../services/toast.service';
import { TextLong } from '../entities/text-long';
import { TextSmall } from '../entities/text-small';
import { TextLongInfo } from '../entities/text_long_info';
import { TextSmallInfo } from '../entities/text_small_info';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-practice',
    standalone: true,
    imports: [FormsModule, DatePipe, ReactiveFormsModule],
    templateUrl: './practice-list.component.html',
    styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {

    private toastService = inject(ToastService);

    constructor(private textLongService: TextLongService, private textSmallService: TextSmallService, public fb: FormBuilder) { }

    items: string[] = [];
    textLongInfos = signal<TextLongInfo[]>([]);
    textSmallInfos = signal<TextSmallInfo[]>([]);

    ngOnInit(): void {
        this.getTextLong();
        this.getTextSmall();
    }

    getTextLong() {
        this.textLongService.getTextLongs().subscribe({
            next: (response) => {
                this.createListTextLong(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }

    createListTextLong(list: any[]) {
        this.textLongInfos.update(item => []);
        this.findDateTextLong(list);
    }

    findDateTextLong(list: any[]) {
        if (list.length == 0) return;

        var lastTextLong = list[list.length - 1];

        var date = lastTextLong['creation'].split("T")[0];

        let textLongInfoFilter = list.filter((e) => e['creation'].split("T")[0] == date);

        let textLongs: TextLong[] = [];
        let indexText: number[] = [];

        for (const text of textLongInfoFilter) {
            textLongs.push(new TextLong(text['id'], text['value'], text['creation'].split("T")[0]))
            indexText.push(list.findIndex(e => e['creation'].split("T")[0] == date));
        }

        this.textLongInfos.update(item => [...item, new TextLongInfo(date, textLongs)]);

        for (const i of indexText) {
            list.splice(i, 1);
        }

        this.findDateTextLong(list);
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