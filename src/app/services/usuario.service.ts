import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient) { }

  crearUsuario = (formData: RegisterForm): Observable<any> => this._http.post(`${BASE_URL}/usuarios`, formData);
}
