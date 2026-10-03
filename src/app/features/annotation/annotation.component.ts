import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AnnotationFacade } from './annotation.facade';
import { AnnotationRecorderService } from './annotation-recorder.service';
@Component({
    selector: 'app-annotation',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './annotation.component.html',
    styleUrls: ['./annotation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AnnotationFacade, AnnotationRecorderService],
})
export class AnnotationComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(AnnotationFacade);
    private readonly recorder = inject(AnnotationRecorderService);

    readonly items = this.facade.items;
    readonly isRecording = this.recorder.isRecording;
    readonly charCountText = signal(0);
    textForm!: FormGroup;
    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.textForm = this.fb.group({
            value: ['', [Validators.required, Validators.maxLength(1100)]],
        });
    }

    /** Atualiza o contador de caracteres conforme o usuário digita. */
    updateCountTex(): void {
        this.charCountText.set((this.textForm.get('value')?.value ?? '').length);
    }

    /** Adiciona o texto atual (se válido) à lista e limpa o campo. */
    addItem(): void {
        if (this.textForm.invalid) {
            return;
        }

        this.facade.addItem(this.textForm.value.value);
        this.textForm.get('value')!.reset();
        this.updateCountTex();
    }

    removeItem(index: number): void {
        this.facade.removeItem(index);
    }

    /** Persiste todas as anotações pendentes. */
    saveAll(): void {
        this.facade.save().subscribe(() => {
            this.textForm.get('value')!.reset();
            this.updateCountTex();
        });
    }

    /** Alterna a gravação de áudio (delegada ao serviço de gravação). */
    async toggleRecording(): Promise<void> {
        await this.recorder.toggle();
    }
}
