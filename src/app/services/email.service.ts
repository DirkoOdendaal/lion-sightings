


import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;


@Injectable()
export class EmailService {

    constructor(private http: Http) { }

    // API: GET /todos
    public async requestEmail(email_address: string) {
        return await this.http
            .get(API_URL + '/api/Excel/getEmail/' + email_address)
            .toPromise()
            .then(response => {
                return Promise.resolve(response.status);
            }).catch(catchError(this.handleError));
    }

    private handleError(error: Response | any) {
        console.error('EmailService::handleError', error);
        return throwError(error);
    }
}
