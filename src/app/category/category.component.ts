import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from '../component/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { Category } from '../entities/category';
import { Word } from '../entities/word';
import { CategoryService } from '../services/category.service';
import { ToastService } from '../services/toast.service';
import { WordService } from '../services/word.service';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ModalComponent, FormsModule],
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
    private toastService = inject(ToastService);

    constructor(private categoryService: CategoryService, private wordService: WordService) { }

    ngOnInit(): void {
        this.getCategorys();
    }

    projectData = {
        nameProject: '',
        word: '',
    };


    categorys = signal<Category[]>([]);

    words = signal<Word[]>([]);

    removeCategory(id: number) {
        this.categorys.update(prev => prev.filter(c => c.id !== id));
    }


    closeModal(modal: any) {
        modal.fechar();
        this.projectData.nameProject = '';

    }

    salvar(modal: any) {
        modal.fechar();

        this.categoryService.saveCategory(this.projectData.nameProject).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.salvarWords(response);

            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
    }

    salvarWords(response: any) {
        this.wordService.saveWord(this.words(), response['id']).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.projectData.nameProject = '';
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

        for (const category of list) {

            let words: Word[] = [];

            for (const word of category['words']) {
                words.push(new Word(word['id'], word['name'], word['id_category']))
            }

            this.categorys.update(item => [...item, new Category(category['id'], category['name'], words)]);
        }

    }


    addItem() {
        this.words.update(item => [...item, new Word(this.words().length, this.projectData.word, -1)]);
        this.projectData.word = '';
    }

}