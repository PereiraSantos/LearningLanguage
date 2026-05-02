import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TextLongService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getTextLongs(): Observable<any> {
        return this.http.get(`${this.API_URL}/api/textlong`);
    }

    saveTextLong(value: string): Observable<any> {
        return this.http.post(`${this.API_URL}/api/textlong`, {
            value: value
        });
    }
}
