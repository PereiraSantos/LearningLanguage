import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../entities/word';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WordService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getWords(): Observable<any> {
        return this.http.get(`${this.API_URL}/api/word`);
    }

    saveWord(words: Word[], idCategory: number): Observable<any> {
        return this.http.post(`${this.API_URL}/api/word`, {
            words: words, idCategory: idCategory
        });
    }

    editWord(word: string, id: number): Observable<any> {
        return this.http.put(`${this.API_URL}/api/word`, {
            word: word, id: id
        });
    }

    getWordBycatgory(idCategory: number): Observable<any> {
        return this.http.post(`${this.API_URL}/api/word` + '/category', {
            idCategory: idCategory
        });
    }
}
