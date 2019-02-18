


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
    public async requestEmail(email_address: string) {
        // const headers = new Headers();
        // headers.append('Content-Type', 'text/json');
        const options = new RequestOptions({
            headers: new Headers({
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              'accept-language': 'en-US,en;q=0.9,af;q=0.8',
              'upgrade-insecure-requests': '1',
              'X-Requested-By': 'lion-sightings',
              'X-Requested-At': new Date().toISOString()
            })
          });

          // const header = new HttpHeaders({
          //   'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
          // });
          // header.append('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
        // headers.append('authentication', `hello`);

        // const optionsNew = new RequestOptions({ headers: header });

        return await this.http
            .get(API_URL + '/api/Excel/getEmail/' + email_address)
            .toPromise()
            .then(response => Promise.resolve(response), (err: HttpErrorResponse) => this.handleError(err));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('EmailService::handleError', error.message);
        return throwError(error.message);
    }
}
