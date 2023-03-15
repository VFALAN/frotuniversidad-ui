import { LoadingInterceptor } from './../../interceptors/loading.interceptor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { NgxPhotograficComponent } from './ngx-photografic/ngx-photografic.component';
import { NgNotificationComponent } from './ng-notification/ng-notification.component';
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { NotificacionService } from "../../services/notificacion.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxFileEvidenceComponent } from './ngx-file-evidence/ngx-file-evidence.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WebcamModule } from 'ngx-webcam';
import { NgxSuxCameraComponent } from './ngx-sux-camera/ngx-sux-camera.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { SnackService } from '../../services/snack.service';


@NgModule({
	declarations: [
		LoadingComponent,
		NgxPhotograficComponent,
		NgNotificationComponent,
		NgxFileEvidenceComponent,
		NgxSuxCameraComponent,
		SnackBarComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		MatIconModule,
		MatBadgeModule,
		MatMenuModule,
		MatButtonModule,
		MatListModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule,
		FormsModule,
		WebcamModule,
		MatDialogModule,
		ReactiveFormsModule],
	exports: [
		NgxFileEvidenceComponent,
		LoadingComponent,
		NgxPhotograficComponent,
		NgNotificationComponent,
		NgxSuxCameraComponent
	], providers: [
		NotificacionService,
		SnackService, {
			provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
		}
	]
})
export class GeneralComponentsModule {
}
