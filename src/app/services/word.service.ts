import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../entities/word';

@Injectable({
    providedIn: 'root'
})
export class WordService {

    private apiUrl = 'http://localhost:3001/api/word';

    constructor(private http: HttpClient) { }

    getWords(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    saveWord(words: Word[], idCategory: number): Observable<any> {
        return this.http.post(this.apiUrl, {
            words: words, idCategory: idCategory
        });
    }

    getWordBycatgory(idCategory: number): Observable<any> {
        return this.http.post(this.apiUrl + '/category', {
            idCategory: idCategory
        });
    }
}
