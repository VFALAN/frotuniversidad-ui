import { Component, forwardRef, HostBinding, Input, OnInit } from '@angular/core';
import { AbstractControlDirective, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';
import { FileEvidence } from '../../../model/FileEvidence';

@Component({
	selector: 'ngx-photografic',
	templateUrl: './ngx-photografic.component.html',
	styleUrls: ['./ngx-photografic.component.sass'],
	providers: [{ provide: MatFormFieldControl, useExisting: NgxPhotograficComponent }]
})
export class NgxPhotograficComponent implements OnInit, MatFormFieldControl<FileEvidence> {
	static nextId = 0;


	@Input()
	set value(value: FileEvidence) {
		this._value = value;
		this.stateChanges.next();
	}


	get value() {
		return this._value;
	}
	private _value!: FileEvidence;
	stateChanges = new Subject<void>();
	@HostBinding()
	id: string = `NgxPhotograficComponent-${NgxPhotograficComponent.nextId}`;

	placeholder!: string;
	ngControl!: NgControl | AbstractControlDirective | null;
	focused!: boolean;
	empty!: boolean;
	shouldLabelFloat!: boolean;
	required!: boolean;
	disabled!: boolean;
	errorState!: boolean;
	controlType?: string | undefined;
	autofilled?: boolean | undefined;
	userAriaDescribedBy?: string | undefined;




	setDescribedByIds(ids: string[]): void {

	}
	onContainerClick(event: MouseEvent): void {

	}
	ngOnInit(): void {

	}



}
