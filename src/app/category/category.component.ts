import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from '../component/modal/modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../entities/category';
import { Word } from '../entities/word';
import { CategoryService } from '../services/category.service';
import { ToastService } from '../services/toast.service';
import { WordService } from '../services/word.service';


@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ModalComponent, FormsModule, ReactiveFormsModule],
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit {
    private toastService = inject(ToastService);

    categorys = signal<Category[]>([]);
    words = signal<Word[]>([]);
    wordAdds = signal<Word[]>([]);
    workForm!: FormGroup
    categoryForm!: FormGroup;


    constructor(private categoryService: CategoryService, private wordService: WordService, public fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
        this.getCategorys();
    }

    initForm() {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
        });

        this.workForm = this.fb.group({
            word: ['', [Validators.required, Validators.maxLength(100)]]
        });
    }

    removeCategory(id: number) {
        this.wordAdds.update(prev => prev.filter(c => c.id !== id));
    }


    closeModal(modal: any) {
        modal.fechar();
        this.categoryForm.get('name')!.reset();
    }

    salvar(modal: any) {
        if (this.categoryForm.valid) {
            modal.fechar();

            this.categoryService.saveCategory(this.categoryForm.value.name).subscribe({
                next: (response) => {
                    this.toastService.show('Projetos salvo com sucesso!', 'info');
                    this.salvarWords(response);
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
        }
    }

    salvarWords(response: any) {
        this.wordService.saveWord(this.wordAdds(), response['id']).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.categoryForm.get('name')!.reset();
                this.getCategorys();
            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
    }
    getCategorys() {
        this.categoryService.getCategorys().subscribe({
            next: (response) => {
                this.createList(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }


    createList(list: any[]) {
        this.categorys.update(item => []);
        this.words.update(item => [])
        this.wordAdds.update(item => []);

        for (const category of list) {

            let words: Word[] = [];

            for (const word of category['words']) {
                words.push(new Word(word['id'], word['name'], word['id_category']))
            }

            this.categorys.update(item => [...item, new Category(category['id'], category['name'], words)]);
        }

    }


    addItem() {
        if (this.workForm.valid) {
            this.wordAdds.update(item => [...item, new Word(this.wordAdds().length, this.workForm.value.word, -1)]);
            this.workForm.get('word')!.reset();
        }
    }

}