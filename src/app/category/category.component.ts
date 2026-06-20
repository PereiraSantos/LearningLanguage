import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from '../component/modal/modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../entities/category';
import { Word } from '../entities/word';
import { CategoryService } from '../services/category.service';
import { ToastService } from '../services/toast.service';
import { WordService } from '../services/word.service';
import { MatIconModule } from '@angular/material/icon'


@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ModalComponent, FormsModule, ReactiveFormsModule, MatIconModule],
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
    category?: Category = undefined;
    word?: Word = undefined;



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

    editCategory(id: number) {
        this.wordAdds.update(prev => prev.filter(c => c.id !== id));
    }

    openModalCategory(modal: any, category: Category) {
        this.category = category;
        this.categoryForm.patchValue({ name: category.name });
        modal.abrir();
    }

    openModalWord(modal: any, word: Word) {
        this.word = word;
        this.workForm.patchValue({ word: word.name });
        modal.abrir();
    }

    openModalWordAdd(modal: any, category: Category) {
        this.category = category;
        this.workForm.patchValue({ word: '' });
        modal.abrir();
    }

    salvar(modal: any) {
        if (this.categoryForm.valid) {
            modal.fechar();

            this.categoryService.saveCategory(this.categoryForm.value.name).subscribe({
                next: (response) => {
                    this.toastService.show('Projetos salvo com sucesso!', 'info');
                    this.salvarWords(response['id']);
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
        }
    }

    edit(modal: any) {
        if (this.categoryForm.valid && this.category != undefined) {
            modal.fechar();

            this.categoryService.editCategory(this.categoryForm.value.name, this.category.id).subscribe({
                next: (response) => {
                    this.toastService.show('Projetos editado com sucesso!', 'info');
                    this.categoryForm.get('name')!.reset();
                    this.getCategorys();
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
        }
    }

    editWord(modal: any) {
        if (this.workForm.valid && this.word != undefined) {
            modal.fechar();

            this.wordService.editWord(this.workForm.value.word, this.word.id).subscribe({
                next: (response) => {
                    this.toastService.show('Projetos editaado com sucesso!', 'info');
                    this.workForm.get('word')!.reset();
                    this.getCategorys();
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
        }
    }

    insertWord(modal: any) {
        if (this.workForm.valid && this.category != undefined) {
            this.addItem();
            modal.fechar();
            this.salvarWords(this.category!.id);
        }
    }

    salvarWords(id: any) {
        this.wordService.saveWord(this.wordAdds(), id).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.workForm.get('word')!.reset();
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