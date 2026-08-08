import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CategoryComponent } from './category/category.component';
import { DialogComponent } from './dialog/dialog.component';
import { AnnotationHistoryComponent } from './annotation-history/annotation-history.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { DialogHistoryComponent } from './dialog-history/dialog-history.component';

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
