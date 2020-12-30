import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  cargarHospitales(){
    const url = `${BASE_URL}/hospitales`; 
    return this._http.get(url, this.headers)
      .pipe(
        map((resp: {ok: boolean, hospitales: Hospital[]}) => resp.hospitales)
      );
  }

  crearHospital(nombre: string){
    const url = `${BASE_URL}/hospitales`; 
    return this._http.post(url, {nombre}, this.headers);
  }

  actualizarHospital(_id: string, nombre: string){
    const url = `${BASE_URL}/hospitales/${_id}`; 
    return this._http.put(url, {nombre}, this.headers);
  }

  borrarHospital(_id: string){
    const url = `${BASE_URL}/hospitales/${_id}`; 
    return this._http.delete(url, this.headers);
  }


}
