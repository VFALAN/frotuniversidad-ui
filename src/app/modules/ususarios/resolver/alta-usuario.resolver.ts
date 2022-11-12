import {Injectable} from '@angular/core';
import {CatalogoEstadosService} from "../../../services/catalogo-estados.service";
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';

@Injectable()
export class AltaUsuarioResolver implements Resolve<boolean> {
  constructor(private catalgoService: CatalogoEstadosService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.catalgoService.getEstados();
  }
}
