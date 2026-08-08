import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextLongService } from '../services/text-long.service';
import { ToastService } from '../services/toast.service';

import { TextLongInfo } from '../entities/text_long_info';



@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    private toastService = inject(ToastService);

    constructor(private textLongService: TextLongService, public fb: FormBuilder) { }

    charCountTextLong = signal(0);

    textLongForm!: FormGroup
    items: string[] = [];
    fileName: string = '';
    isRecording: boolean = false;
    mediaRecorder: any;

    textLongInfos = signal<TextLongInfo[]>([]);

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.textLongForm = this.fb.group({
            value: ['', [Validators.required, Validators.maxLength(1100)]],
        });
    }

    updateCountTexLong() {
        this.charCountTextLong.set((this.textLongForm.value.value).length);
    }

    saveContent() {
        if (this.textLongForm.valid) {
            this.textLongService.saveTextLong(this.textLongForm.value.value).subscribe({
                next: (response) => {
                    this.toastService.show('Texto salvo com sucesso!', 'info');

                    this.textLongForm.get('value')!.reset();
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
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