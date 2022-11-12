import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { MenuComponent } from './components/menu/menu.component';
import { SessionComponent } from './components/session/session.component';


@NgModule({
  declarations: [
    MenuComponent,
    SessionComponent
  ],
  exports: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule
  ]
})
export class InicioModule { }
