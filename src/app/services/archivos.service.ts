import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ArchivosService {

	constructor(private _http: HttpClient,) {

	}
	_baseUrl = `http://localhost:8083/${environment.apis.minio}`

	disabledFile(idArchivo: any): Observable<boolean> {
		const opt = {
			params: {
				idArchivo
			}
		}
		return this._http.delete<boolean>(`${this._baseUrl}file/disabledFile`, opt)
	}

}
