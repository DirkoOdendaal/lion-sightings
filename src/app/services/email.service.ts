


import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Injectable()
export class EmailService {

    constructor(private http: HttpClient) { }

    // API: GET /todos
    public requestEmail(email_address: string) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json'
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
