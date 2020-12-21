import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const BASE_URL = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private _http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return  {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.auth2.signOut().then(() => {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this._http.get(`${BASE_URL}/login/renew`,{
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) =>{
        const { nombre, email,img = '', google, role, uid} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '',google, img, role, uid );
        localStorage.setItem('token',resp.token);
        return true;
      }),
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

  actualizarPerfil(data: {email: string, nombre: string, role: string}){
    data = {
      ...data, 
      role: this.usuario.role
    };
    return this._http.put(`${BASE_URL}/usuarios/${this.uid}`, data, this.headers);
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

  cargarUsuarios(desde: number = 0){
    const url = `${BASE_URL}/usuarios?desde=${desde}`; 
    return this._http.get<CargarUsuario>(url, this.headers)
        .pipe(
          map(resp =>{
            const usuarios = resp.usuarios.map( 
              user => new Usuario(user.nombre, user.email, '', user.google, user.img, user.role, user.uid)
            )
            return {
              total: resp.total,
              usuarios
            };
          })
        );
  }

  eliminarUsuario(usuario: Usuario){
    const url = `${BASE_URL}/usuarios/${usuario.uid}`; 
    return this._http.delete(url, this.headers);
  }

  guardarusuario(usuario: Usuario){
    return this._http.put(`${BASE_URL}/usuarios/${usuario.uid}`, {
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role
      }, this.headers);
  }



}
