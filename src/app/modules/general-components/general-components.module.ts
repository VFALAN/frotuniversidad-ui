import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { NgxPhotograficComponent } from './ngx-photografic/ngx-photografic.component';
import { NgNotificationComponent } from './ng-notification/ng-notification.component';



@NgModule({
  declarations: [
    LoadingComponent,
    NgxPhotograficComponent,
    NgNotificationComponent
  ],
  imports: [
    CommonModule
  ],
	exports : [

		LoadingComponent,
		NgxPhotograficComponent,
		NgNotificationComponent
	]
})
export class GeneralComponentsModule { }
