import { Injectable } from '@angular/core';
import {
	Router, Resolve,
	RouterStateSnapshot,
	ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable()
export class DetalleUsuarioResolver implements Resolve<boolean> {
	constructor(private _UsuarioService: UsuarioService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		const idUsuario = route.params['idUsuario']
		const detalleRequest = this._UsuarioService.findById(idUsuario);
		return detalleRequest;
	}
}
