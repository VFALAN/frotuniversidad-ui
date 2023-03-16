import { Injectable } from '@angular/core';
import {
	Router, Resolve,
	RouterStateSnapshot,
	ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { ArchivosService } from '../../../services/archivos.service';
import { CATALOGO_TIPO_ARCHIVO } from '../../../utils/Catalogos';

@Injectable()
export class DetalleUsuarioResolver implements Resolve<boolean> {
	constructor(private _UsuarioService: UsuarioService, private _ArchivoService: ArchivosService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		const idUsuario = route.params['idUsuario'];

		const usuario$ = this._UsuarioService.findById(idUsuario);
		const listaArchivo$ = this._ArchivoService.getAllFilesByUser(idUsuario);
		return forkJoin({
			usuario: usuario$,
			listaArchivos: listaArchivo$
		});

	}
}
