import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { SnackService } from '../services/snack.service';
import { TypeSnakBar } from '../utils/TypeSnakBar.enum';

@Injectable()
export class ErrorAlertInterceptor implements HttpInterceptor {

	constructor(private _SnackService: SnackService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
			if (error.status === 500) {
				console.log({ error });
				this._SnackService.openSnackBar(error.message, TypeSnakBar.error);
			}
			return throwError(() => new Error(error.message))
		}));
	}

}
