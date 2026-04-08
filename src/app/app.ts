import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { PracticeComponent } from './practice/practice.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryComponent, PracticeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
