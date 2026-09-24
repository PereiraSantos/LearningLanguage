import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ModalComponent } from '../component/modal/modal.component';
import { OpenableModal } from '../component/modal/modal.contract';
import { Category } from '../entities/category';
import { Word } from '../entities/word';
import { CategoryFacade } from './category.facade';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ModalComponent, FormsModule, ReactiveFormsModule, MatIconModule],
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CategoryFacade],
})
export class CategoryComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(CategoryFacade);

    readonly categories = this.facade.categories;
    readonly pendingWords = this.facade.pendingWords;

    readonly categoryForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(100)]],
    });

    readonly wordForm: FormGroup = this.fb.group({
        word: ['', [Validators.required, Validators.maxLength(100)]],
    });

    private selectedCategory?: Category;
    private selectedWord?: Word;

    ngOnInit(): void {
        this.facade.loadCategories();
    }

    // ----- Abertura de modais -----

    openEditCategory(modal: OpenableModal, category: Category): void {
        this.selectedCategory = category;
        this.categoryForm.patchValue({ name: category.name });
        modal.abrir();
    }

    openEditWord(modal: OpenableModal, word: Word): void {
        this.selectedWord = word;
        this.wordForm.patchValue({ word: word.name });
        modal.abrir();
    }

    openAddWord(modal: OpenableModal, category: Category): void {
        this.selectedCategory = category;
        this.facade.clearPendingWords();
        this.wordForm.patchValue({ word: '' });
        modal.abrir();
    }

    // ----- Ações de palavras no modal -----

    addPendingWord(): void {
        if (this.wordForm.invalid) {
            return;
        }
        this.facade.addPendingWord(this.wordForm.value.word);
        this.wordForm.get('word')!.reset();
    }

    removePendingWord(id: number): void {
        this.facade.removePendingWord(id);
    }

    // ----- Casos de uso -----

    createCategory(modal: OpenableModal): void {
        if (this.categoryForm.invalid) {
            return;
        }
        modal.fechar();
        this.facade
            .createCategory(this.categoryForm.value.name, this.pendingWords())
            .subscribe(() => this.categoryForm.get('name')!.reset());
    }

    updateCategory(modal: OpenableModal): void {
        if (this.categoryForm.invalid || !this.selectedCategory) {
            return;
        }
        modal.fechar();
        this.facade
            .updateCategory(this.categoryForm.value.name, this.selectedCategory.id)
            .subscribe(() => this.categoryForm.get('name')!.reset());
    }

    updateWord(modal: OpenableModal): void {
        if (this.wordForm.invalid || !this.selectedWord) {
            return;
        }
        modal.fechar();
        this.facade
            .updateWord(this.wordForm.value.word, this.selectedWord.id)
            .subscribe(() => this.wordForm.get('word')!.reset());
    }

    insertWords(modal: OpenableModal): void {
        if (this.wordForm.invalid || !this.selectedCategory) {
            return;
        }
        this.addPendingWord();
        modal.fechar();
        this.facade.saveWords(this.pendingWords(), this.selectedCategory.id);
    }
}
