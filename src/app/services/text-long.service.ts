import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TextLongService {

    private apiUrl = 'http://localhost:3001/api/textlong';

    constructor(private http: HttpClient) { }

    getTextLongs(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    saveTextLong(value: string): Observable<any> {
        return this.http.post(this.apiUrl, {
            value: value
        });
    }
}
