import { Prodotto } from './../model/Prodotto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {
  baseurl = 'https://shoporganizer.herokuapp.com/public/api';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    })
  };

  constructor(private http: HttpClient) { }

  // Restituisce observable elenco di tutti i prodotti...
  getProdotti(): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(this.baseurl + '/prodotti', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }

  // Gestione errore api HTTP
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Errore client-side
      errorMessage = error.error.message;
    } else {
      // Errore server-side
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
