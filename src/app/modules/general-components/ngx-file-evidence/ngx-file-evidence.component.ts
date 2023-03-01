
import { Component, Input, OnInit, ViewChild, ElementRef, forwardRef, OnDestroy, HostBinding, Optional, Self } from '@angular/core';
import { FileEvidence } from '../../../model/FileEvidence';
import { AbstractControlDirective, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { baseUrlDataToFile } from '../../../utils/FileUtils';
import { MatFormFieldControl } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { ArchivosService } from '../../../services/archivos.service';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { NgxSuxCameraComponent } from '../ngx-sux-camera/ngx-sux-camera.component';

@Component({
	selector: 'ngx-file-evidence',
	templateUrl: './ngx-file-evidence.component.html',
	styleUrls: ['./ngx-file-evidence.component.css'],
	providers: [
		// 	{
		// 	provide: NG_VALUE_ACCESSOR,
		// 	useExisting: forwardRef(() => NgxFileEvidenceComponent),
		// 	multi: true
		// },
		{
			provide: MatFormFieldControl, useExisting: NgxFileEvidenceComponent
		}]
})
export class NgxFileEvidenceComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<FileEvidence> {
	static nextId = 0;
	readonly EXTENCIONES_IMAGENES = 'image/*';
	readonly ALL_EXTENCIONS = '*/*'
	readonly IMAGENES = ['jpg', 'png', 'gif', 'svg', 'bmp']


	@ViewChild('btnCloseModal', { static: false })
	bntCloseModal !: ElementRef;

	@ViewChild(MatInput, { read: ElementRef, static: true })
	input!: ElementRef;


	@Input()
	accept: string = this.ALL_EXTENCIONS;

	@Input()
	titulo_fotografia = 'FOTOGRAFIA'

	_value: FileEvidence | undefined = undefined;
	webcamImage!: WebcamImage;
	trigger: Subject<void> = new Subject();
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
	id: string = `NgxFileEvidence-${NgxFileEvidenceComponent.nextId}`
	_placeholder!: string;
	// ngControl!: NgControl | AbstractControlDirective | null;
	focused!: boolean;
	_empty!: boolean;


	@HostBinding('class.floated')
	get shouldLabelFloat(): boolean {
		return this.focused || !this.empty
	}
	@Input()
	required!: boolean;
	@Input()
	disabled!: boolean;
	errorState!: boolean;
	controlType?: string | undefined;
	autofilled?: boolean | undefined;
	userAriaDescribedBy?: string | undefined;
	constructor(private _http: HttpClient, private archivoService: ArchivosService, private focusMonitor: FocusMonitor,
		@Optional() @Self() public ngControl: NgControl, public dialog: MatDialog
	) {
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
	}


	ngOnInit(): void {
		this.focusMonitor.monitor(this.input).subscribe(
			(focused) => {
				this.focused = !!focused; this.stateChanges.next()
			});
		this.validarCamera();
		this.checkButtons();
	}
	ngOnDestroy(): void {
		this.focusMonitor.stopMonitoring(this.input);
		this.stateChanges.complete();
	}


	get value() {
		return this._value as FileEvidence;
	}
	@Input()
	set value(v: FileEvidence) {
		this._value = v;
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
		return this._value?.nombre == null;
	}

	setDescribedByIds(ids: string[]): void {

	}
	onContainerClick(event: MouseEvent): void {

	}





	public triggerSnapshot(): void {
		this.trigger.next();
	}

	get triggerObservable(): Observable<any> {
		return this.trigger.asObservable();
	}

	get nextwebcamObservable(): Observable<any> {
		return this.nextWebcam.asObservable();
	}

	public handleImage(webcamImage: WebcamImage): void {
		const fechaStr = moment(new Date()).format('yyyy-MM-dd');

		this.webcamImage = webcamImage;
		Swal.fire({
			title: 'Desea Usar Esta Fotografia',
			imageUrl: webcamImage.imageAsDataUrl,
			showCancelButton: true,
			confirmButtonText: 'Si, Guardar',
			cancelButtonText: 'Tomar Otra Foto'
		}).then((res) => {
			if (res.isConfirmed) {
				const file = baseUrlDataToFile(webcamImage.imageAsDataUrl, `${this.titulo_fotografia}_${fechaStr}.png`, 'image/png');
				this._value = new FileEvidence();
				this._value.file = file;
				this._value.extencion = 'png'
				this._value.nombre = `${this.titulo_fotografia}_${fechaStr}.png`
				this._value.isDropeedFile = false;
				this.showCamera = false;
				this.bntCloseModal.nativeElement.click();
				this.checkButtons();
			} else {
				this.showCamera = true;

			}
		})
	}

	selectionFile(pFileList: any) {
		const file: File = pFileList[0];
		const tmpFileEvicende = {} as FileEvidence;
		tmpFileEvicende.file = file;
		tmpFileEvicende.nombre = file.name;
		tmpFileEvicende.type = file.type
		console.log(file)
		this.writeValue(tmpFileEvicende)
		this.onChange(tmpFileEvicende)
	}

	preView() {
		this.IMAGENES.forEach(e => { })
	}
	download() {
		if (this._value != undefined) {
			this._http.get<any>(this._value.downloadUrl).subscribe(res => {
				console.log(res)
			}, err => {
				console.log(err)
			}, () => {
				console.log('Termino de consumo')
			})
		}
	}
	dropFile(): void {
		if (this._value != undefined) {
			Swal.fire({
				title: 'Confirmar Eliminación',
				text: `Esta Seguro de eliminar el archivo: ${this._value.nombre} no podra ser recuperado más adelante`,
				showCancelButton: true,
				confirmButtonText: 'Eliminar el Archivo',
				cancelButtonText: 'Cancelar'
			}).then(res => {
				if (res.isConfirmed) {
					console.log('reseteando el componente')
					this._value = undefined
					console.log(this._value)
					this._empty = true;
					this.writeValue(undefined);
					this.checkButtons()
				}
			})
		}
	}

	disableFile(): void {
		if (this._value != undefined) {
			if (this._value.id != undefined && this._value.id != null) {
				this.archivoService.disabledFile(this._value.id).subscribe({
					next: (res) => {
						console.log('El archivo fue dado de baja', res)
					}, error: (err) => { console.log(err) }, complete: () => {
						console.log('se completo la peticion')
					}
				});
			}
		}
	}

	writeValue(obj: any): void {
		this._value = obj
		this.checkButtons();
	}
	registerOnChange(fn: any): void {
		this.onChange = fn
	}
	registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	checkButtons(): void {
		const is_image_enable = this.accept.includes(this.EXTENCIONES_IMAGENES) || this.accept == this.ALL_EXTENCIONS;
		if (this._value != null && this._value != undefined && !this._value.isDropeedFile) {
			//value download
			this.enableDownload = (this._value.downloadUrl != '' && this._value.downloadUrl != undefined) ? true : false;
			this.enableDropFile = (this._value.file != undefined || this._value.data != undefined || this._value.downloadUrl != undefined) ? true : false;
			this.enableCamera = (is_image_enable && !this.enableDownload);
			this.enableSelectFile = (this._value.nombre == null || this._value.nombre == undefined || this._value.nombre == '')
			this.enablePreView = (is_image_enable && this.enableSelectFile)

		} else {
			this.enableDownload = false;
			this.enablePreView = false;
			this.enableDropFile = false;
			this.enableSelectFile = true;
			this.enableCamera = is_image_enable
		}
	}

	takePicture() {

		if (this.enableCamera && this.hasCameraEnable) {
			let filePicture: any;
			const dialogCameraRef = this.dialog.open(NgxSuxCameraComponent, { data: {} })
			dialogCameraRef.afterClosed().subscribe(result => {
				console.log(result)
				console.log(filePicture)
				if (result) {
					console.log(result)

				} else {
					console.log(' no se capturo la foto')
				}
			})
		}
	}
	private validPreview(): boolean {
		return true;
	}
	validarCamera(): void {
		if (this.accept == this.ALL_EXTENCIONS || this.accept.includes(this.EXTENCIONES_IMAGENES)) {
			this.enableCamera = true;
		} else {
			this.enableCamera = false;
		}
	}

	handlerinitError(error: WebcamInitError) {
		if (error.mediaStreamError && error.mediaStreamError.name == 'NotAllowedError') {
			this.hasCameraEnable = false;
			console.warn("Camera access was allowed by user!")
		} else {
			this.hasCameraEnable = true;
		}
	}
}
