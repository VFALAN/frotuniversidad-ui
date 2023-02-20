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
	form2: any
	hide: boolean = true;
	data: any;
	constructor(private authentificationService: AuthetificationService,
		private router: Router,
		private fb: FormBuilder) {
		this.form = this.fb.group({
			username: [null, [Validators.required]],
			password: [null, [Validators.required]],
			data: [null]
		})
		this.form2 = this.fb.group({
			data: null
		});
	}

	ngOnInit(): void {
	}
	printeVAlue() {
		console.log(this.form2.controls['data'].value)
		console.log(this.data)
	}
	login() {
		const dataLogin: LoginDTO = this.form.getRawValue();
		this.authentificationService.login(dataLogin).subscribe((respuesta) => {
			if (respuesta != "") {
				sessionStorage.setItem(EStorageKeys.USER_TOKEN, respuesta);
				this.router.navigate(["inicio"]);

			}
		}, (error: HttpErrorResponse) => {
			console.log(error.message);
		})
	}
}
