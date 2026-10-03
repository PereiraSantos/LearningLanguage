import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AnnotationFacade } from '../annotation.facade';
import { TextSmallService } from '../../../shared/services/text-small.servie';
import { ToastService } from '../../../core/services/toast.service';

describe('AnnotationFacade', () => {
  const textSmallService = {
    saveTextSmall: vi.fn(),
  };
  const toastService = {
    show: vi.fn(),
  };

  let facade: AnnotationFacade;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AnnotationFacade,
        { provide: TextSmallService, useValue: textSmallService },
        { provide: ToastService, useValue: toastService },
      ],
    });
    facade = TestBed.inject(AnnotationFacade);
  });

  it('deve iniciar com uma lista vazia', () => {
    expect(facade.items()).toEqual([]);
  });

  it('deve adicionar um item normalizado', () => {
    facade.addItem('  hello  ');

    expect(facade.items()).toEqual(['hello']);
  });

  it('não deve adicionar itens em branco', () => {
    facade.addItem('   ');
    facade.addItem(null);

    expect(facade.items()).toEqual([]);
  });

  it('deve remover um item pelo índice', () => {
    facade.addItem('a');
    facade.addItem('b');
    facade.addItem('c');

    facade.removeItem(1);

    expect(facade.items()).toEqual(['a', 'c']);
  });

  it('deve limpar a lista', () => {
    facade.addItem('a');

    facade.clear();

    expect(facade.items()).toEqual([]);
  });

  it('deve exibir um toast de erro e não chamar o serviço quando a lista estiver vazia', () => {
    facade.save().subscribe();

    expect(textSmallService.saveTextSmall).not.toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('deve persistir os itens, exibir um toast de sucesso e limpar a lista', () => {
    textSmallService.saveTextSmall.mockReturnValue(of({}));
    facade.addItem('a');
    facade.addItem('b');

    facade.save().subscribe();

    expect(textSmallService.saveTextSmall).toHaveBeenCalledWith(['a', 'b']);
    expect(toastService.show).toHaveBeenCalledWith(expect.any(String), 'info');
    expect(facade.items()).toEqual([]);
  });

  it('deve exibir um toast de erro e manter os itens quando o salvamento falhar', () => {
    textSmallService.saveTextSmall.mockReturnValue(throwError(() => new Error('fail')));
    facade.addItem('a');

    facade.save().subscribe();

    expect(toastService.show).toHaveBeenCalledWith(expect.any(String), 'error');
    expect(facade.items()).toEqual(['a']);
  });
});

