import { Component, OnInit } from '@angular/core';
import { AuthetificationService } from "../../services/authetification.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginDTO } from "../../models/login-dto";
import { HttpErrorResponse } from "@angular/common/http";
import { EStorageKeys } from "../../../../utils/estorage-keys";
import { Router } from "@angular/router";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
	form: FormGroup
	hide: boolean = true;
	data: any
	constructor(private authentificationService: AuthetificationService,
		private router: Router,
		private fb: FormBuilder) {
		this.form = this.fb.group({
			username: [null, [Validators.required]],
			password: [null, [Validators.required]],
			data: [null, [Validators.required]]
		})

	}

	ngOnInit(): void {
		this.data = {
			"nombre": "FOTOGRAFIA_REGISTRO_2023-01-Th.png",
			"path": "ADMN/VIFA951002HDFLLL08/FOTOGRAFIA_REGISTRO.png",
			"id": 1,
			"extencion": "png",
			"downloadUrl": "http://192.168.0.2:9000/informacionpersonal/ADMN/VIFA951002HDFLLL08/FOTOGRAFIA_REGISTRO.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230224%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230224T030445Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=6f8324fb9d9bff9d2a1623fdee062f3a27ef1d9f515b89c8899c67de95aa8051",
			"tipoArchivo": "FOTOGRAFIA_REGISTRO"
		}
	}

	login() {
		const dataLogin: LoginDTO = this.form.getRawValue();
		this.authentificationService.login(dataLogin).subscribe(respuesta => {
			if (respuesta != "") {
				sessionStorage.setItem(EStorageKeys.USER_TOKEN, respuesta);
				this.router.navigate(["inicio"]);

			}
		}, (error: HttpErrorResponse) => {
			console.log(error.message);
		})
	}
	show() {
		console.log('mostrando info')
		console.log(this.data, 'NGMODEL')
		console.log(this.form.controls['data'].value, 'FORMDATA')
	}
}
