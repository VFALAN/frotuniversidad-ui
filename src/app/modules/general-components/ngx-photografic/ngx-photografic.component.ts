import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector: 'app-ngx-photografic',
	templateUrl: './ngx-photografic.component.html',
	styleUrls: ['./ngx-photografic.component.sass'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => NgxPhotograficComponent)
		}
	]
})
export class NgxPhotograficComponent implements OnInit, ControlValueAccessor {
	private onTouchet !: Function;
	private onchenged !: Function;


	photografiFile!: File;

	constructor() {
	}

	ngOnInit(): void {
	}

	registerOnChange(fn: any): void {
		this.onchenged=fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouchet = fn;
	}

	setDisabledState(isDisabled: boolean): void {
	}

	writeValue(obj: any): void {
	}

}
