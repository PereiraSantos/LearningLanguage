import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnnotationComponent } from '../annotation.component';
import { TextSmallService } from '../../services/text-small.servie';
import { ToastService } from '../../services/toast.service';

describe('AnnotationComponent', () => {
  const textSmallService = {
    saveTextSmall: vi.fn(),
  };
  const toastService = {
    show: vi.fn(),
  };

  let fixture: ComponentFixture<AnnotationComponent>;
  let component: AnnotationComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    textSmallService.saveTextSmall.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AnnotationComponent],
      providers: [
        { provide: TextSmallService, useValue: textSmallService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar e inicializar o formulário', () => {
    expect(component).toBeTruthy();
    expect(component.textForm).toBeTruthy();
    expect(component.items()).toEqual([]);
  });

  it('deve adicionar um texto válido à lista e limpar o campo', () => {
    component.textForm.setValue({ value: '  Hello  ' });

    component.addItem();

    expect(component.items()).toEqual(['Hello']);
    expect(component.textForm.get('value')?.value).toBeNull();
  });

  it('não deve adicionar um texto inválido', () => {
    component.textForm.setValue({ value: '' });

    component.addItem();

    expect(component.items()).toEqual([]);
  });

  it('deve atualizar o contador de caracteres', () => {
    component.textForm.setValue({ value: 'abc' });

    component.updateCountTex();

    expect(component.charCountText()).toBe(3);
  });

  it('deve remover um item pelo índice', () => {
    component.textForm.setValue({ value: 'a' });
    component.addItem();
    component.textForm.setValue({ value: 'b' });
    component.addItem();

    component.removeItem(0);

    expect(component.items()).toEqual(['b']);
  });

  it('deve salvar os itens e limpar a lista', () => {
    component.textForm.setValue({ value: 'a' });
    component.addItem();

    component.saveAll();

    expect(textSmallService.saveTextSmall).toHaveBeenCalledWith(['a']);
    expect(component.items()).toEqual([]);
  });

  it('deve desabilitar o botão de salvar quando não houver itens', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-save');
    expect(button.disabled).toBe(true);
  });
});

