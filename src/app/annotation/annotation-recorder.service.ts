import { Injectable, signal } from '@angular/core';

/**
 * Encapsula a API `MediaRecorder`/`getUserMedia` do navegador.
 *
 * Isola o acesso ao microfone fora do componente (SRP) e remove o uso de
 * `any`, expondo um estado reativo (`isRecording`) que a view pode consumir.
 */
@Injectable()
export class AnnotationRecorderService {
    private readonly _isRecording = signal(false);
    private mediaRecorder?: MediaRecorder;
    private stream?: MediaStream;

    readonly isRecording = this._isRecording.asReadonly();

    /** Inicia a gravação, solicitando permissão de microfone. */
    async start(): Promise<void> {
        if (this._isRecording()) {
            return;
        }

        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.start();
        this._isRecording.set(true);
    }

    /** Encerra a gravação e libera os recursos do microfone. */
    stop(): void {
        if (!this.mediaRecorder || !this._isRecording()) {
            return;
        }

        this.mediaRecorder.stop();
        this.mediaRecorder = undefined;

        this.stream?.getTracks().forEach((track) => track.stop());
        this.stream = undefined;

        this._isRecording.set(false);
    }

    /** Alterna entre iniciar e parar a gravação. */
    async toggle(): Promise<void> {
        if (this._isRecording()) {
            this.stop();
        } else {
            await this.start();
        }
    }
}
