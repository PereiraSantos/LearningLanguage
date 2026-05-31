import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CategoryComponent } from './category/category.component';
import { PracticeComponent } from './practice/practice.component';
import { PracticeListComponent } from './practice-list/practice-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '',
        component: Home,
        children: [
            { path: '', redirectTo: 'category', pathMatch: 'full' },
            { path: 'category', component: CategoryComponent },
            { path: 'practice', component: PracticeComponent },
            { path: 'practice-list', component: PracticeListComponent }
        ]
    }
];
