import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent {
    @Input() titulo: string = 'Título do Modal';

    exibir: boolean = false;

    abrir() {
        this.exibir = true;
    }

    fechar() {
        this.exibir = false;
    }


    cliqueNoFundo(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.fechar();
        }
    }
}