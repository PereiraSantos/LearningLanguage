import { Routes } from '@angular/router';
import { Home } from './core/layout/home/home';
import { CategoryComponent } from './features/category/category.component';
import { DialogComponent } from './features/dialog/dialog.component';
import { AnnotationHistoryComponent } from './features/annotation-history/annotation-history.component';
import { AnnotationComponent } from './features/annotation/annotation.component';
import { DialogHistoryComponent } from './features/dialog-history/dialog-history.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '',
        component: Home,
        children: [
            { path: '', redirectTo: 'category', pathMatch: 'full' },
            { path: 'category', component: CategoryComponent },
            { path: 'dialog', component: DialogComponent },
            { path: 'annotation', component: AnnotationComponent },
            { path: 'dialog-history', component: DialogHistoryComponent },
            { path: 'annotation-history', component: AnnotationHistoryComponent }
        ]
    }
];

