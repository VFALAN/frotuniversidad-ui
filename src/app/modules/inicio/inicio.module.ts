import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { MenuComponent } from './components/menu/menu.component';
import { SessionComponent } from './components/session/session.component';
import {GeneralComponentsModule} from "../general-components/general-components.module";


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
        InicioRoutingModule,
        GeneralComponentsModule
    ]
})
export class InicioModule { }
