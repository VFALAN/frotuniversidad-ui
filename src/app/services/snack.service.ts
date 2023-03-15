import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar'
import { TypeSnakBar } from '../utils/TypeSnakBar.enum';
import { SnackBarComponent } from '../modules/general-components/snack-bar/snack-bar.component';
@Injectable({
	providedIn: 'root'
})
export class SnackService {
	private _defaultHorizontalPosition: MatSnackBarHorizontalPosition = 'end';
	private _defaultVerticalPosition: MatSnackBarVerticalPosition = 'top';
	private _defaultDuration = 5000
	constructor(private _snackBar: MatSnackBar) { }


	openSanckBar(message: string): void {
		this._snackBar.open(message, '', {
			duration: this._defaultDuration,
			horizontalPosition: this._defaultHorizontalPosition,
			verticalPosition: this._defaultVerticalPosition,

		});
	}

	openSnackBar(message: string, type: TypeSnakBar): void {
		let ngClass: string = '';
		switch (type) {
			case TypeSnakBar.info:
				ngClass = 'alert-primary';
				break;
			case TypeSnakBar.error:
				ngClass = 'alert-danger';
				break;
			case TypeSnakBar.sucess:
				ngClass = 'alert-success';
				break;
			case TypeSnakBar.warning:
				ngClass = 'alert-warning';
				break;
		}
		this._snackBar.openFromComponent(SnackBarComponent, {
			data: {
				message,
				ngClass
			},
			duration: this._defaultDuration,
			horizontalPosition: this._defaultHorizontalPosition,
			verticalPosition: this._defaultVerticalPosition,
		})

	}
}
