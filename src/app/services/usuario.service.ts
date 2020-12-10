import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';

const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient) { }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this._http.get(`${BASE_URL}/login/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any) =>{
        localStorage.setItem('token',resp.token);
      }),
      map( resp => true),
      catchError(err => of(false))
    )
  }

  crearUsuario (formData: RegisterForm): Observable<any> {
    return this._http.post(`${BASE_URL}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) =>{
                    localStorage.setItem('token',resp.token);
                  })
                );
                }

  login (formData: LoginForm): Observable<any> {
    return this._http.post(`${BASE_URL}/login`, formData)
          .pipe(
            tap( (resp: any) =>{
              localStorage.setItem('token',resp.token);
            })
          );
  }

  loginGoogle (token: string): Observable<any> {
    return this._http.post(`${BASE_URL}/login/google`, {token})
          .pipe(
            tap( (resp: any) =>{
              localStorage.setItem('token',resp.token);
            })
          );
  }
}
