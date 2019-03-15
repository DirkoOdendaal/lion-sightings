


import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Injectable()
export class EmailService {

    constructor(private http: HttpClient) { }

    // API: GET /todos
    public requestEmail(email_address: string) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive',
              'Host': '34.76.212.212'
            })
          };

        return this.http
            .get(API_URL + '/api/Excel/getEmail/' + email_address, httpOptions)
            .toPromise()
            .then(response => Promise.resolve(response), (err: HttpErrorResponse) => this.handleError(err));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('EmailService::handleError', error.message);
        return throwError(error.message);
    }
}
