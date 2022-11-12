import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionComponent} from "./components/session/session.component";

const routes: Routes = [
  {
    path: '',
    component: SessionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule {
}
