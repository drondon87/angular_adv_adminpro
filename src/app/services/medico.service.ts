import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.model';


const BASE_URL = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private _http: HttpClient) { }

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

  cargarMedicos(){
    const url = `${BASE_URL}/medico`; 
    return this._http.get(url, this.headers)
      .pipe(
        map((resp: {ok: boolean, medicos: Medico[]}) => resp.medicos)
      );
  }

  crearMedico(medico: {nombre: string, hospital: string }){
    const url = `${BASE_URL}/medico`; 
    return this._http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico){
    const url = `${BASE_URL}/medico/${medico._id}`; 
    return this._http.put(url, medico, this.headers);
  }

  borrarMedico(_id: string){
    const url = `${BASE_URL}/medico/${_id}`; 
    return this._http.delete(url, this.headers);
  }

  getMedicoPorId(_id: string){
    const url = `${BASE_URL}/medico/${_id}`; 
    return this._http.get(url, this.headers)
      .pipe(
        map((resp: {ok: boolean, medico: Medico}) => resp.medico)
      );
  }

}
