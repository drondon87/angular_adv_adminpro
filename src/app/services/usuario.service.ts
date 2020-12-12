import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';

const BASE_URL = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private _http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 
    this.googleInit();
  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      });
    });
  }

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

   googleInit(){

    return new Promise(resolve =>{
      gapi.load('auth2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id: '154133610773-42engbr2br7jfdek9d1v0rumbhkmsdht.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });
      });
    });
  }
}
