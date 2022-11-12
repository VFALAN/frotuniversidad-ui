import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CatalogoEstadosService {

  constructor(private _http:HttpClient) { }

  getEstados():Observable <any> {
    return this._http.get<any>('http://localhost:8082/msuniversidad-usuarios/api/catalogos/estados');
  }
  getMunicipios(idEstado:any):Observable<any>{
    return this._http.get<any>(`http://localhost:8082/msuniversidad-usuarios/api/catalogos/municipios/${idEstado}`);
  }

  getAsentamiento(idMunicipio:any):Observable<any>{
    return this._http.get<any>(`http://localhost:8082/msuniversidad-usuarios/api/catalogos/asentamientos/${idMunicipio}`)
  }
}
