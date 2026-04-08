import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private apiUrl = 'http://localhost:3000/api/category';

    constructor(private http: HttpClient) { }

    getCategorys(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    saveCategory(name: string): Observable<any> {
        return this.http.post(this.apiUrl, {
            name: name
        });
    }
}
