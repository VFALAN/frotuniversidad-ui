
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileEvidence } from '../../../model/FileEvidence';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { baseUrlDataToFile } from '../../../utils/FileUtils';

@Component({
	selector: 'ngx-file-evidence',
	templateUrl: './ngx-file-evidence.component.html',
	styleUrls: ['./ngx-file-evidence.component.css'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: NgxFileEvidenceComponent,
		multi: true
	}]
})
export class NgxFileEvidenceComponent implements OnInit, ControlValueAccessor {
	@ViewChild('btnCloseModal', { static: false })
	bntCloseModal !: ElementRef;
	readonly EXTENCIONES_IMAGENES = 'image/*';
	readonly ALL_EXTENCIONS = '*/*'
	_reloadValue: FileEvidence = new FileEvidence();
	_value!: FileEvidence;
	webcamImage!: WebcamImage;
	trigger: Subject<void> = new Subject();

	nextWebcam: Subject<void> = new Subject();
	@Input()
	labelText = 'Seleccione un Archivo'

	@Input()
	acept: string = this.ALL_EXTENCIONS;

	@Input()
	titulo_fotografia = 'FOTOGRAFIA'

	enableDownload: boolean = true;
	enableCamera: boolean = true;
	enablePreView: boolean = true;
	enableSelectFile: boolean = true;
	enableDropFile: boolean = true;
	hasCameraEnable: boolean = false;
	showCamera: boolean = false;


	get value() {
		return this._value
	}
	set value(v: FileEvidence) {
		this._value = v;

	}


	checkButtons(): void {

		const is_image_enable = this.acept.includes(this.EXTENCIONES_IMAGENES) || this.acept == this.ALL_EXTENCIONS;
		if (this._value != null && this._value != undefined && !this._value.isDropeedFile) {
			//value download
			this.enableDownload = (this._value.downloadUrl != '' && this._value.downloadUrl != undefined) ? true : false;
			this.enableDropFile = (this._value.file != undefined || this._value.data != undefined) ? true : false;
			this.enableCamera = (is_image_enable && this.enableDownload);
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

	constructor() { }

	ngOnInit(): void {
		this.validarCamera();
		this.checkButtons();
	}

	validarCamera(): void {
		if (this.acept == this.ALL_EXTENCIONS || this.acept.includes(this.EXTENCIONES_IMAGENES)) {
			this.enableCamera = true;
		} else {
			this.enableCamera = false;
		}
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
		const titulo = 'FOTOGRAFIA_REGISTRO'
		this.webcamImage = webcamImage;
		Swal.fire({
			title: 'Desea Usar Esta Fotografia',
			imageUrl: webcamImage.imageAsDataUrl,
			showCancelButton: true,
			confirmButtonText: 'Si, Guardar',
			cancelButtonText: 'Tomar Otra Foto'
		}).then((res) => {
			if (res.isConfirmed) {
				const capturaImage = webcamImage!.imageAsDataUrl.split(',')[1];

				const file = baseUrlDataToFile(webcamImage.imageAsDataUrl, `${this.titulo_fotografia}_${fechaStr}.png`, 'image/png');
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
		throw new Error('Method not implemented.');
	}

	selectionFile(pFileList: any) {
		const file: File = pFileList[0];
		const tmpFileEvicende = {} as FileEvidence;

		tmpFileEvicende.file = file;
		tmpFileEvicende.nombre = file.name;
		tmpFileEvicende.type = file.type
		this.writeValue(tmpFileEvicende)
	}

	preView() { }
	downLoad() { }
	dropFile(): void {
		this._value = new FileEvidence()
		this._value.nombre = '';
		this._value.downloadUrl = '';
		this._value.isDropeedFile = true
		this.checkButtons()
	}
	onChange() { }
	onTouch() { }

	handlerinitError(error: WebcamInitError) {
		if (error.mediaStreamError && error.mediaStreamError.name == 'NotAllowedError') {
			this, this.hasCameraEnable = false;
			console.warn("Camera access was allowed by user!")
		} else {
			this.hasCameraEnable = true;
		}
	}
}
