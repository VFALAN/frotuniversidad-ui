import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class NotificacionService {
	url: string = "http://localhost:8084/api/notificaciones"

	constructor(private _http: HttpClient) {
	}


	obtenerNotificaciones(idUsuario: any) {
		const opt = {
			params: {
				idUsuario
			}
		}
		return this._http.get<any[]>(`${this.url}/getNotifications`, opt);
	}
}
