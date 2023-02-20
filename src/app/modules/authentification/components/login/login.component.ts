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
	constructor(private authentificationService: AuthetificationService,
		private router: Router,
		private fb: FormBuilder) {
		this.form = this.fb.group({
			username: [null, [Validators.required]],
			password: [null, [Validators.required]],
			data: [null]
		})

	}

	ngOnInit(): void {
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
