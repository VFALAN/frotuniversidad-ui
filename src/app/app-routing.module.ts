import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/authentification/authentification.module').then((m) => m.AuthentificationModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./modules/inicio/inicio.module').then((m) => m.InicioModule)
  },
  {
    path : 'usuarios',
    loadChildren : ()=>import('./modules/ususarios/ususarios.module').then( ( m)=>m.UsusariosModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
