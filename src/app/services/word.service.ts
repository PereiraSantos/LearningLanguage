import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word, WordDTO } from '../entities/word';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WordService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getWords(): Observable<WordDTO[]> {
        return this.http.get<WordDTO[]>(`${this.API_URL}/api/word`);
    }

    saveWord(words: Word[], idCategory: number): Observable<WordDTO[]> {
        return this.http.post<WordDTO[]>(`${this.API_URL}/api/word`, {
            words: words, idCategory: idCategory
        });
    }

    editWord(word: string, id: number): Observable<WordDTO> {
        return this.http.put<WordDTO>(`${this.API_URL}/api/word`, {
            word: word, id: id
        });
    }

    getWordBycatgory(idCategory: number): Observable<WordDTO[]> {
        return this.http.post<WordDTO[]>(`${this.API_URL}/api/word` + '/category', {
            idCategory: idCategory
        });
    }
}
