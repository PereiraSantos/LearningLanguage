import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TextSmallService {

    private apiUrl = 'http://localhost:3000/api/textsmall';

    constructor(private http: HttpClient) { }

    getTextSmalls(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    saveTextSmall(value: string[]): Observable<any> {
        return this.http.post(this.apiUrl, {
            value: value
        });
    }
}
