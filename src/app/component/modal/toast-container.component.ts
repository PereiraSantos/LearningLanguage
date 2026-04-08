import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type">
          {{ toast.message }}
          <button (click)="toastService.remove(toast.id)">x</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      display: flex;
      justify-content: space-between;
      min-width: 200px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    }
    .success { background-color: #2ecc71; }
    .error { background-color: #e74c3c; }
    .info { background-color: #3498db; }
    button { 
      background: none; 
      color: white; 
      cursor: pointer; 
      font-size: 18px; 
      margin-top: -5px;
      margin-left: 10px;
      border-radius: 6px;
      border: 2px solid white;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}