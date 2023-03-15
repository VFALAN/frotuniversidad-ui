
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
	_value !: FileEvidence | null;


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
	get disabled() {
		return this._disabled
	}

	set disabled(dis) {
		this._disabled = coerceBooleanProperty(dis);
		this.stateChanges.next();
	}

	private _disabled!: boolean;


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

	}



	get errorState(): boolean {

		return this.touched && this._value == null;
	}
	ngOnInit(): void {
		this.focusMonitor.monitor(this.input).subscribe(
			(focused) => {
				this.focused = !!focused; this.stateChanges.next()
			});
		this.focusMonitor.monitor(this.input).pipe(take(1)).subscribe(() => {
			this.onTouch();
		})

		this.validarCamera();
		this.checkButtons();
	}
	ngOnDestroy(): void {
		this.focusMonitor.stopMonitoring(this.input);
		this.stateChanges.complete();
	}


	get value() {
		return this._value
	}
	@Input()
	set value(v: FileEvidence | null) {
		this._value = v;
		this.onChange(v);
		this.onTouch(v);
	}


	get placeHolder() {
		return this._placeholder;
	}
	@Input()
	set placeholder(placeHolder: string) {
		this._placeholder = placeHolder;
		this.stateChanges.next();
	}
	get empty(): boolean {
		return this._value === null;
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
		if (this._value !== null) {

			this._http.get(this._value.downloadUrl, { responseType: 'arraybuffer' }).subscribe({
				next: (response) => {
					this.preview();

					const blob = new Blob([response], { type: this._value?.type })
					console.log(blob);
					saveAs(blob, this._value?.nombre);
				},
				error: (error) => {
					console.error(error)
				}
			})
		}
	}
	dropFile(): void {
		if (this._value !== null) {
			if (this._value.id != null) {
				Swal.fire({
					title: 'Confirmar Eliminación',
					text: `Esta Seguro de eliminar el archivo: ${this._value.nombre} no podra ser recuperado más adelante`,
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
				this._empty = true;
				this._value.nombre = '';
				this._value.file = null;
			}
		}
		this._value = null
		this.stateChanges.next();
		this.checkButtons();
	}

	disableFile(): void {
		if (this._value !== null) {
			if (this._value.id != undefined && this._value.id != null) {
				this.archivoService.disabledFile(this._value.id).subscribe({
					next: (res) => {
						// se desactivo el archivo
					}, error: (err) => { console.log(err) }, complete: () => {
						console.log('se completo la peticion')
						this.checkButtons();
					}
				});
			}
		}
	}

	writeValue(obj: any): void {
		this._value = obj;
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
		this._disabled = isDisabled;
	}
	preview() {
		Swal.fire({
			imageUrl: this._value?.downloadUrl,
			imageHeight: 500
		})
	}
	checkButtons(): void {
		const is_image_enable = this.accept.includes(this.EXTENCIONES_IMAGENES) || this.accept == this.ALL_EXTENCIONS;
		if (this._value != null) {

			this.enableSelectFile = false;
			this.enableCamera = false;
			this.enableDropFile = true;
			this.enableDownload = this._value.downloadUrl != null;
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
			dialogCameraRef.afterClosed().subscribe((result: File) => {
				this._value = new FileEvidence();
				if (result) {
					this._value.extencion = '.png'
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
			type: file.type,
			file
		}
		this.writeValue(tmpFileEvicende)
		this.onChange(tmpFileEvicende)
	}
	private validPreview(): boolean {
		let isEnable = false;
		if (this._value !== null && this._value.extencion != null && this._value.downloadUrl != null) {
			const extencion: string = this._value.extencion;
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
