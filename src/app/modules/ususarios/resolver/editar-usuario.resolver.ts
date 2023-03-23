import { Injectable } from '@angular/core';
import {
	Router, Resolve,
	RouterStateSnapshot,
	ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { ArchivosService } from '../../../services/archivos.service';
import { CatalogoEstadosService } from '../../../services/catalogo-estados.service';

@Injectable()
export class EditarUsuarioResolver implements Resolve<any> {
	constructor(private _UsaurioService: UsuarioService,
		private _CatalogoService: CatalogoEstadosService,
		private _ArchivoService: ArchivosService) { }


	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		const idUsuario = route.params['idUsuario'];
		const usuario = this._UsaurioService.findById(idUsuario);
		const archivos = this._ArchivoService.getAllFilesByUser(idUsuario);
		const estados = this._CatalogoService.getEstados();
		return forkJoin({
			usuario,
			archivos,
			estados
		})
	}
}
