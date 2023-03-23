import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GeneralComponentsModule } from './modules/general-components/general-components.module';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { ErrorAlertInterceptor } from './interceptors/error-alert.interceptor';
import { interceptorProviders } from './interceptors/provider-iterceptors';


@NgModule({
	declarations: [
		AppComponent

	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		GeneralComponentsModule

	],
	providers: [HttpClientModule,
		interceptorProviders],
	bootstrap: [AppComponent]
})
export class AppModule { }
