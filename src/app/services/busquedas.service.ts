import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
const BASE_URL = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return  {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.google, user.img, user.role, user.uid)
    );
  }

  buscar(tipo: 'usuarios'|'medicos'|'hospitales', termino: string){
    const url = `${BASE_URL}/todo/colleccion/${tipo}/${termino}`; 
    return this.http.get<any[]>(url, this.headers)
        .pipe(
          map((resp:any) =>{
            switch(tipo){
              case 'usuarios': return this.transformarUsuarios(resp.resultados);
              case 'medicos': return;
              case 'hospitales': return;
            }
          })
        );
  }
}
