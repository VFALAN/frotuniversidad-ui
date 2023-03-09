
import { Component, Input, OnInit, ViewChild, ElementRef, forwardRef, OnDestroy, HostBinding, Optional, Self, Inject } from '@angular/core';
import { FileEvidence } from '../../../model/FileEvidence';
import { AbstractControlDirective, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable, take } from 'rxjs';
import Swal from 'sweetalert2';
import { MatFormField, MatFormFieldControl, MAT_FORM_FIELD } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { ArchivosService } from '../../../services/archivos.service';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { NgxSuxCameraComponent } from '../ngx-sux-camera/ngx-sux-camera.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { saveAs } from 'file-saver';
@Component({
	selector: 'ngx-file-evidence',
	templateUrl: './ngx-file-evidence.component.html',
	styleUrls: ['./ngx-file-evidence.component.css'],
	providers: [
		{
			provide: MatFormFieldControl, useExisting: NgxFileEvidenceComponent
		}]
})
export class NgxFileEvidenceComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<FileEvidence> {
	static nextId = 0;
	readonly EXTENCIONES_IMAGENES = 'image/*';
	readonly ALL_EXTENCIONS = '*/*'
	readonly IMAGENES = ['jpg', 'png', 'gif', 'svg', 'bmp']
	form !: FormGroup;


	@ViewChild(MatInput, { read: ElementRef, static: true })
	input!: ElementRef;


	@Input()
	accept: string = this.ALL_EXTENCIONS;

	@Input()
	titulo_fotografia = 'FOTOGRAFIA'

	@Input('aria-describedby') userAriaDescribedBy!: string;
	webcamImage!: WebcamImage;
	nextWebcam: Subject<void> = new Subject();
	enableDownload: boolean = true;
	enableCamera: boolean = true;
	enablePreView: boolean = true;
	enableSelectFile: boolean = true;
	enableDropFile: boolean = true;
	hasCameraEnable: boolean = true;
	showCamera: boolean = false;
	onChange: any = (value: FileEvidence | undefined) => { }
	onTouch: any = () => { }
	stateChanges = new Subject<void>();
	@HostBinding()
	id: string = `NgxFileEvidence-${NgxFileEvidenceComponent.nextId}`
	_placeholder!: string;
	focused!: boolean;
	_empty!: boolean;
	touched!: boolean;


	@HostBinding('class.floated')
	get shouldLabelFloat(): boolean {
		return this.focused || !this.empty
	}

	@Input()
	get required() {
		return this._required;
	}

	set required(req) {
		this._required = coerceBooleanProperty(req);
		this.stateChanges.next();
	}

	private _required = false;
	@Input()
	disabled!: boolean;


	controlType!: string | undefined;
	autofilled!: boolean | undefined;

	onFocusIn(event: FocusEvent) {
		if (!this.focused) {
			this.focused = true;
			this.stateChanges.next()
		}
	}

	onFocusOut(event: FocusEvent) {
		if (!this.input.nativeElement.contains(event.relatedTarget as Element)) {
			this.touched = true;
			this.focused = false;
			this.onTouch();
			this.stateChanges.next()
		}
	}






	constructor(private _http: HttpClient,
		private archivoService: ArchivosService,
		private focusMonitor: FocusMonitor,
		@Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
		@Optional() @Self() public ngControl: NgControl,
		public dialog: MatDialog,
		fb: FormBuilder,
		public errorMattcher: ErrorStateMatcher
	) {
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
		this.form = fb.group({
			id: [''],
			file: [''],
			selectedFile: [''],
			nombre: ['', [Validators.required]],
			path: [''],
			mineType: [''],
			downloadUrl: [''],
			extencion: [''],
			data: [''],
			tipoArchivo: [''],
			type: ['']
		});
	}



	get errorState(): boolean {

		return this.form.invalid && this.touched
	}
	ngOnInit(): void {
		this.focusMonitor.monitor(this.input).subscribe(
			(focused) => {
				this.focused = !!focused; this.stateChanges.next()
			});
		this.focusMonitor.monitor(this.input).pipe(take(1)).subscribe(() => {
			this.onTouch();
		})
		this.form.valueChanges.subscribe((value) => {
			this.onChange(value)
		})
		this.validarCamera();
		this.checkButtons();
	}
	ngOnDestroy(): void {
		this.focusMonitor.stopMonitoring(this.input);
		this.stateChanges.complete();
	}


	get value() {
		return this.form.value
	}
	@Input()
	set value(v: FileEvidence | null) {
		if (v instanceof FileEvidence) {
			this.form.patchValue(v)
		}
		this.onChange(v)
		this.onTouch(v)
	}


	get placeHolder() {
		return this._placeholder
	}
	@Input()
	set placeholder(placeHolder: string) {
		this._placeholder = placeHolder
		this.stateChanges.next()
	}
	get empty(): boolean {
		return this.form.invalid
	}

	setDescribedByIds(ids: string[]): void {
		const controlElement = this.input.nativeElement
		controlElement.setAttribute('aria-describedby', ids.join(' '));
	}
	onContainerClick(event: MouseEvent): void {
		this.touched = true
		this.stateChanges.next()
	}



	download() {
		if (this.form.valid) {

			this._http.get(this.form.controls['downloadUrl'].value, { responseType: 'arraybuffer' }).subscribe({
				next: (response) => {
					this.preview();
					console.log(this.form.getRawValue())
					const blob = new Blob([response], { type: this.form.controls['mineType'].value })
					console.log(blob);
					saveAs(blob, this.form.controls['nombre'].value);
				},
				error: (error) => {
					console.error(error)
				}
			})
		}
	}
	dropFile(): void {
		if (this.form.valid) {
			if (this.form.controls['id'].value != null) {
				Swal.fire({
					title: 'Confirmar Eliminación',
					text: `Esta Seguro de eliminar el archivo: ${this.form.controls['nombre'].value} no podra ser recuperado más adelante`,
					showCancelButton: true,
					confirmButtonText: 'Eliminar el Archivo',
					cancelButtonText: 'Cancelar'
				}).then(res => {
					if (res.isConfirmed) {
						this.disableFile();
					}
					this.stateChanges.next();
				})
			} else {
				this.cleanForm();
			}
		}
		this.stateChanges.next();
	}
	private cleanForm() {
		this.form.controls['file'].setValue(null)
		this.form.controls['nombre'].enable();
		this.form.controls['nombre'].setValue('');
		this.form.controls['nombre'].setValidators(Validators.required)
		this.checkButtons();
		this.ngOnInit();
	}
	disableFile(): void {
		if (this.form.valid) {
			if (this.form.controls['id'].value != undefined && this.form.controls['id'].value != null) {
				this.archivoService.disabledFile(this.form.controls['id'].value).subscribe({
					next: (res) => {
						this.archivoService.disabledFile(this.form.controls['id'].value).subscribe({
							next: (response => {
								this.cleanForm();
							}),
							error: (error => { console.log(error) }),
							complete: () => { }
						})
					}, error: (err) => { console.log(err) }, complete: () => {
						console.log('se completo la peticion')
						this.checkButtons();
					}
				});
			}
		}
	}

	writeValue(obj: any): void {
		console.log(obj)
		if (obj != null) {
			this.form.patchValue(obj);
			this.form.controls['nombre'].value != '' ? this.form.controls['nombre'].disable() : this.form.controls['nombre'].enable();
		}
		this.checkButtons();
		this.stateChanges.next();
	}
	registerOnChange(fn: any): void {
		this.onChange = fn
	}
	registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this.form.disable();
	}
	preview() {
		Swal.fire({
			imageUrl: this.form.controls['downloadUrl'].value,
			imageHeight: 500
		})
	}
	checkButtons(): void {
		const is_image_enable = this.accept.includes(this.EXTENCIONES_IMAGENES) || this.accept == this.ALL_EXTENCIONS;
		if (this.form.valid) {

			this.enableSelectFile = false;
			this.enableCamera = false;
			this.enableDropFile = true;
			this.enableDownload = this.form.controls['downloadUrl'].value != null || this.form.controls['downloadUrl'].value.includes('http')
			this.enablePreView = this.validPreview();
		} else {

			this.enableSelectFile = true;
			this.enableCamera = is_image_enable;
			this.enablePreView = false;
			this.enableDropFile = false
			this.enableDownload = false;
		}
	}

	takePicture() {

		if (this.enableCamera && this.hasCameraEnable) {
			const dialogCameraRef = this.dialog.open(NgxSuxCameraComponent, { data: {} })
			dialogCameraRef.afterClosed().subscribe(result => {
				if (result) {
					this.form.controls['extencion'].setValue('png');
					const fileList = [result];
					this.touched = true;
					this.selectionFile(fileList);
				}
			});
		}
	}

	selectionFile(pFileList: any) {
		const file = pFileList[0];
		console.log({ file })
		const tmpFileEvicende = {
			nombre: file.name,
			type: file.type
		}
		this.form.controls['file'].setValue(file)
		this.writeValue(tmpFileEvicende)
		this.onChange(tmpFileEvicende)
	}
	private validPreview(): boolean {
		let isEnable = false;
		if (this.form.valid && this.form.controls['extencion'].value != null && this.form.controls['downloadUrl'].value != '') {
			const extencion: string = this.form.controls['extencion'].value;
			this.IMAGENES.forEach(i => {
				if (extencion.includes(i) || i === extencion) {
					isEnable = true;
				}
			})
		}
		return isEnable;
	}
	validarCamera(): void {
		if (this.accept == this.ALL_EXTENCIONS || this.accept.includes(this.EXTENCIONES_IMAGENES)) {
			this.enableCamera = true;
		} else {
			this.enableCamera = false;
		}
	}


}
