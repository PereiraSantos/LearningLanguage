import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextSmallService } from '../services/text-small.servie';
import { ToastService } from '../services/toast.service';

import { TextLongInfo } from '../entities/text_long_info';
import { TextSmallInfo } from '../entities/text_small_info';



@Component({
    selector: 'app-annotation',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './annotation.component.html',
    styleUrls: ['./annotation.component.css']
})
export class AnnotationComponent implements OnInit {

    private toastService = inject(ToastService);

    constructor(private textSmallService: TextSmallService, public fb: FormBuilder) { }

    charCountText = signal(0);
    textForm!: FormGroup
    items: string[] = [];
    fileName: string = '';
    isRecording: boolean = false;
    mediaRecorder: any;

    textLongInfos = signal<TextLongInfo[]>([]);
    textSmallInfos = signal<TextSmallInfo[]>([]);

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.textForm = this.fb.group({
            value: ['', [Validators.required, Validators.maxLength(1100)]]
        });
    }



    updateCountTex() {
        this.charCountText.set((this.textForm.value.value).length);
    }

    saveAll() {
        this.textSmallService.saveTextSmall(this.items).subscribe({
            next: (response) => {
                this.toastService.show('Texto salvo com sucesso!', 'info');

                this.textForm.get('value')!.reset();

                this.items = [];

            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
    }

    addItem() {
        if (this.textForm.valid) {
            const text = this.textForm.value.value.trim();
            if (text) {
                this.items.push(text);
                this.textForm.get('value')!.reset();
            }
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