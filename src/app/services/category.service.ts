import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategoryDTO } from '../entities/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCategorys(): Observable<CategoryDTO[]> {
        return this.http.get<CategoryDTO[]>(`${this.API_URL}/api/category`);
    }

    saveCategory(name: string): Observable<CategoryDTO> {
        return this.http.post<CategoryDTO>(`${this.API_URL}/api/category`, {
            name: name
        });
    }

    editCategory(name: string, id: number): Observable<CategoryDTO> {
        return this.http.put<CategoryDTO>(`${this.API_URL}/api/category`, {
            name: name,
            id: id
        });
    }
}
