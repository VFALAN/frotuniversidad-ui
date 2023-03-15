import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
	selector: 'app-snack-bar',
	templateUrl: './snack-bar.component.html',
	styleUrls: ['./snack-bar.component.sass']
})
export class SnackBarComponent implements OnInit {
	message!: string;

	constructor(public _snackBarRef: MatSnackBarRef<SnackBarComponent>,
		@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

	ngOnInit(): void {
	}
	closeSnackBar() {
		this._snackBarRef.dismiss();
	}
}
