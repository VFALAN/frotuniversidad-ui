import {Injectable} from '@angular/core';
import {BaseService} from "../../../utils/services/base-service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {UsuarioTableDTO} from "../model/usuario-table-dto";
import {Observable} from "rxjs";
import {UsuarioDTO} from "../model/usuario-dto";

@Injectable({
	providedIn: 'root'
})
export class UsuarioService extends BaseService<any, any, UsuarioTableDTO> {

	constructor(protected override _http: HttpClient) {
		super(_http, `http://localhost:8082/msuniversidad-usuarios/api/usuarios`);


	}

	guardar(usuario: UsuarioDTO, fotografia: File) {
		const formData = new FormData();
		formData.append('usuario', JSON.stringify(usuario));
		formData.append('file', fotografia);
		return this._http.post<any>(this._base, formData);
	}

	validarUsuario(nombreUsuario: string, correo: string) {
		const opt = {
			params: {
				nombreUsuario,
				correo
			}
		}
		return this._http.get<any>(`${this._base}/validarUsuario`, opt)
	}


}
