import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsusariosRoutingModule } from './ususarios-routing.module';
import { AltaUsuarioComponent } from './components/alta-usuario/alta-usuario.component';
import { DetalleUsuarioComponent } from './components/detalle-usuario/detalle-usuario.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { TablaUsuarioComponent } from './components/tabla-usuario/tabla-usuario.component';
import { GraficaUsuarioComponent } from './components/grafica-usuario/grafica-usuario.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {UsuarioService} from "./services/usuario.service";
import {InicioModule} from "../inicio/inicio.module";
import {MatTable, MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBar, MatProgressBarModule} from "@angular/material/progress-bar";
import {CatalogoEstadosService} from "../../services/catalogo-estados.service";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {GeneralComponentsModule} from "../general-components/general-components.module";
import {MatSortModule} from "@angular/material/sort";
import { NgxMatFileInputModule} from "@angular-material-components/file-input";
import {WebcamModule} from "ngx-webcam";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";


@NgModule({
  declarations: [
    AltaUsuarioComponent,
    DetalleUsuarioComponent,
    EditarUsuarioComponent,
    TablaUsuarioComponent,
    GraficaUsuarioComponent
  ],
    imports: [
        CommonModule,
        UsusariosRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        HttpClientModule,
        InicioModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatDividerModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        GeneralComponentsModule,
        MatSortModule,
        NgxMatFileInputModule,
        WebcamModule,
        MatSlideToggleModule
    ],
  providers : [
    UsuarioService,
    CatalogoEstadosService
  ]
})
export class UsusariosModule { }
