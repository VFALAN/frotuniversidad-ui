import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GeneralComponentsModule } from './modules/general-components/general-components.module';
import { LoadingInterceptor } from './interceptors/loading.interceptor';


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
	providers: [HttpClientModule, {
		provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
	}],
	bootstrap: [AppComponent]
})
export class AppModule { }
