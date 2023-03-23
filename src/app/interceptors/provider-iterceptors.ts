import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorAlertInterceptor } from './error-alert.interceptor';
import { LoadingInterceptor } from './loading.interceptor';
export const interceptorProviders = [{
	provive: HTTP_INTERCEPTORS, useClass: ErrorAlertInterceptor, multi: true
}, {
	provive: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
}]
