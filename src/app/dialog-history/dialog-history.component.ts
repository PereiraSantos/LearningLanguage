import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextLongService } from '../services/text-long.service';
import { ToastService } from '../services/toast.service';
import { TextLong } from '../entities/text-long';
import { TextLongInfo } from '../entities/text_long_info';
import { DatePipe } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';


@Component({
    selector: 'app-dialog-history',
    standalone: true,
    imports: [FormsModule, DatePipe, ReactiveFormsModule, TextFieldModule],
    templateUrl: './dialog-history.component.html',
    styleUrls: ['./dialog-history.component.css']
})
export class DialogHistoryComponent implements OnInit {

    private toastService = inject(ToastService);

    constructor(private textLongService: TextLongService, public fb: FormBuilder) { }

    items: string[] = [];
    textLongInfos = signal<TextLongInfo[]>([]);

    ngOnInit(): void {
        this.getTextLong();
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
}