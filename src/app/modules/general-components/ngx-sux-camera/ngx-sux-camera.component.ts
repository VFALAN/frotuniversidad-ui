import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { WebcamInitError, WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { baseUrlDataToFile } from '../../../utils/FileUtils';

@Component({
	selector: 'app-ngx-sux-camera',
	templateUrl: './ngx-sux-camera.component.html',
	styleUrls: ['./ngx-sux-camera.component.sass']
})
export class NgxSuxCameraComponent implements OnInit {
	hasCameraEnable: boolean = true;
	webcamImage!: WebcamImage;
	trigger: Subject<void> = new Subject();
	nextWebcam: Subject<void> = new Subject();
	enableDownload: boolean = true;

	constructor(public dialogRef: MatDialogRef<NgxSuxCameraComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit(): void {
		console.log('se abrio el componente')
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
				const file = baseUrlDataToFile(webcamImage.imageAsDataUrl, `Picture_${fechaStr}.png`, 'image/png');
				console.log(file, 'archivo generado');
				this.data = file;
				console.log(this.data);

			}
		})
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
