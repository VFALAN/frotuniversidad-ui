import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TablaUsuarioComponent} from "./components/tabla-usuario/tabla-usuario.component";
import {UsuarioService} from "./services/usuario.service";
import {AltaUsuarioResolver} from "./resolver/alta-usuario.resolver";
import {EditarUsuarioResolver} from "./resolver/editar-usuario.resolver";
import {DetalleUsuarioResolver} from "./resolver/detalle-usuario.resolver";
import {GraficaUsuarioResolver} from "./resolver/grafica-usuario.resolver";
import {TablaUsuarioResolver} from "./resolver/tabla-usuario.resolver";
import {EditarUsuarioComponent} from "./components/editar-usuario/editar-usuario.component";
import {AltaUsuarioComponent} from "./components/alta-usuario/alta-usuario.component";
import {DetalleUsuarioComponent} from "./components/detalle-usuario/detalle-usuario.component";
import {GraficaUsuarioComponent} from "./components/grafica-usuario/grafica-usuario.component";

const routes: Routes = [
  {
    path: '',
    component: TablaUsuarioComponent
  },
  {
    path: 'editar-usuario/:idUsuario',
    component: EditarUsuarioComponent,
    resolve: {
      data: EditarUsuarioResolver
    }
  },
  {
    path: 'alta-usuarios',
    component: AltaUsuarioComponent,
    resolve: {
      data: AltaUsuarioResolver
    }
  },
  {
    path: 'detalle-usuario/:idUsuario',
    component: DetalleUsuarioComponent,
    resolve: {
      data: DetalleUsuarioResolver
    }
  },
  {
    path : 'grafica-usuarios',
    component : GraficaUsuarioComponent,
    resolve : {
      data: GraficaUsuarioResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AltaUsuarioResolver,
    EditarUsuarioResolver,
    DetalleUsuarioResolver,
    GraficaUsuarioResolver,
    TablaUsuarioResolver
  ]
})
export class UsusariosRoutingModule {
}
