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

	buscarPorFiltros(page: any, size: any, column: string = '', order: string = '', filters: string = '') {
		const opt = {
			params: {
				page,
				size,
				column,
				order,
				filters
			}
		}
		return this._http.get<any>(this._base, opt);
	}

	guardar(usuario: UsuarioDTO, fotografia: File, curp: File, actaNacimineto: File, comprobanteDomicilio: File) {
		const formData = new FormData();
		formData.append('usuario', JSON.stringify(usuario));
		formData.append('fotografia', fotografia);
		formData.append('curp', curp);
		formData.append('comprobante', comprobanteDomicilio);
		formData.append('actaNacimiento', actaNacimineto);
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

	disableOrEnable(idUsuario: any) {
		const opt = {
			params: {
				idUsuario
			}
		}
		return this._http.put<number>(`${this._base}/disabled`, null, opt);
	}


}
