import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FileEvidence } from '../model/FileEvidence';

@Injectable({
	providedIn: 'root'
})
export class ArchivosService {

	constructor(private _http: HttpClient,) {

	}
	_baseUrl = `${environment.baseUrl}${environment.apis.minio}`

	disabledFile(idArchivo: any): Observable<boolean> {
		const opt = {
			params: {
				idArchivo
			}
		}
		return this._http.delete<boolean>(`${this._baseUrl}file/disabledFile`, opt)
	}
	getAllFilesByUser(idUsuario: any): Observable<FileEvidence[]> {
		const opt = {
			params: { idUsuario }
		}
		return this._http.get<FileEvidence[]>(`${this._baseUrl}file/getFilesByUser`, opt)
	}

	getFileByUserAndType(idUsaurio: any, idTIpoArchivo: any, limite = 1): Observable<FileEvidence[]> {
		const opt = {
			params: {idUsaurio,idTIpoArchivo,limite}
		}
		return this._http.get<FileEvidence[]>(`${this._baseUrl}file/getByUserAndType`, opt)
	}

}
