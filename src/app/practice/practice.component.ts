import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    imports: [FormsModule, DatePipe],
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

    private toastService = inject(ToastService);

    constructor(private textLongService: TextLongService, private textSmallService: TextSmallService) { }


    charCount = signal(0);
    currentTextLong: string = '';
    currentText: string = '';
    items: string[] = [];
    fileName: string = '';
    isRecording: boolean = false;
    mediaRecorder: any;

    textLongInfos = signal<TextLongInfo[]>([]);
    textSmallInfos = signal<TextSmallInfo[]>([]);

    ngOnInit(): void {
        this.getTextLong();
        this.getTextSmall();
    }

    updateCount() {
        this.charCount.set(this.currentTextLong.length);
    }

    saveContent() {
        this.textLongService.saveTextLong(this.currentTextLong).subscribe({
            next: (response) => {
                this.toastService.show('Texto salvo com sucesso!', 'info');
                this.getTextLong();
                this.currentTextLong = '';
            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
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

    saveAll() {
        this.textSmallService.saveTextSmall(this.items).subscribe({
            next: (response) => {
                this.toastService.show('Texto salvo com sucesso!', 'info');
                this.getTextSmall();
            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
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
        this.currentText = '';

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

    addItem() {
        const text = this.currentText.trim();
        if (text) {
            this.items.push(text);
            this.currentText = '';
        }
    }

    removeItem(index: number) {
        this.items.splice(index, 1);
    }

    handleUpload(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.fileName = file.name;
            console.log('Arquivo selecionado:', file);
        }
    }

    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.isRecording = true;
            this.fileName = 'Gravando áudio...';

            this.mediaRecorder.start();
            console.log('Gravação iniciada');
        } catch (err) {
            console.error('Erro ao acessar microfone:', err);
            alert('Permissão de microfone negada.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.fileName = 'Gravação concluída';

            this.mediaRecorder.ondataavailable = (e: any) => {
                const audioBlob = e.data;
                console.log('Áudio gravado (Blob):', audioBlob);
            };
        }
    }



}