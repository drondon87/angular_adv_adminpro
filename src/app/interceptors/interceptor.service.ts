import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  onstructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'x-token': this.token
    })

    const reqClone = req.clone({
      headers
    });
    
    return next.handle(reqClone)
    /*const headers = new HttpHeaders({
      'token-usuario': 'ABDASD5515454DADSADa'
    })

    const reqClone = req.clone({
      headers
    });

    return next.handle(reqClone)
    .pipe(
      catchError(this.manejarError)
    )*/
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }
}
