import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ComboDTO } from "../../../../model/combo-dto";
import { CatalogoEstadosService } from "../../../../services/catalogo-estados.service";
import { UsuarioService } from "../../services/usuario.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CATALOGO_ESTATUS, CATALOGO_GENERO, CATALOGO_PERFILES } from "../../../../utils/Catalogos";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import * as moment from "moment";
import { map, Observable, startWith, Subject } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import Validation from "../../../../utils/Validation";
import Swal from 'sweetalert2'
import { UsuarioDTO } from "../../model/usuario-dto";
import { SnackService } from '../../../../services/snack.service';
import { TypeSnakBar } from '../../../../utils/TypeSnakBar.enum';
import { FileEvidence } from '../../../../model/FileEvidence';


@Component({
	selector: 'app-alta-usuario',
	templateUrl: './alta-usuario.component.html',
	styleUrls: ['./alta-usuario.component.sass']
})
export class AltaUsuarioComponent implements OnInit {
	@ViewChild('btnCloseModal', { static: false })
	bntCloseModal !: ElementRef;
	hasCamera: boolean = false;
	isLoading = false;
	startDate = new Date(1980, 0, 1);
	hidePassword = true;
	hideConfirmPasswod = true;
	isAvalibleCorreo: boolean = true;
	isAvalibleNombreUsuario: boolean = true;
	catalogoEstados: ComboDTO[] = [];
	filtredEstados !: Observable<ComboDTO[]>;
	catalgoMunicipios: ComboDTO[] = [];
	filtredMunicipios!: Observable<ComboDTO[]>;
	catalogoAsentamietno: ComboDTO[] = [];
	filtredAsentaminetos!: Observable<ComboDTO[]>;
	catalogoPlanteles: ComboDTO[] = [];
	filtredPlanteles!: Observable<ComboDTO[]>;
	catalogoGenero: ComboDTO[] = CATALOGO_GENERO;
	catalogoPerfil: ComboDTO[] = CATALOGO_PERFILES;
	catalogoEstaus: ComboDTO[] = CATALOGO_ESTATUS;
	catalogoCarreras: ComboDTO[] = [];
	form !: FormGroup;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private catalogoService: CatalogoEstadosService,
		private usuarioService: UsuarioService,
		private _snakeBarService: SnackService,
		private fb: FormBuilder) {
	}

	ngOnInit(): void {
		this.catalogoEstados = this.route.snapshot.data['data'];
		this.initForm();
	}

	initForm(): void {
		this.form = this.fb.group({
			apellidoPaterno: [null, Validators.required],
			apellidoMaterno: [null, Validators.required],
			nombre: [null, Validators.required],
			correo: [null, [Validators.required, Validators.email,
			Validation.emailAvalible(this.isAvalibleCorreo)]
			],
			nombreUsuario: [null, [Validators.required,
			Validation.usernameAvalible(this.isAvalibleNombreUsuario)
			],
			],
			curp: [null, Validators.required],
			password: [null, [Validators.required,
			Validation.containUpper(),
			Validation.containLoweer(),
			Validation.containUpper(),
			Validation.containNumber(),
			Validation.containSpecialCaracter(),
			Validators.minLength(8)]],
			passwordComfirm: [null, Validators.required],
			idEstatus: [null, Validators.required],
			idPerfil: [null, Validators.required],
			idEstado: [null, Validators.required],
			estado: [null, Validators.required],
			idMunicipio: [null, Validators.required],
			municipio: [null, Validators.required],
			idAsentamiento: [null, Validators.required],
			asentamiento: [null, Validators.required],
			desGenero: [{ value: null, disabled: true }, Validators.required],
			genero: [null, Validators.required],
			edad: [{ value: null, disabled: true }, Validators.required],
			fechaNacimiento: [null, Validators.required],
			calle: [null, Validators.required],
			desFachada: [null, Validators.required],
			numeroInterior: [null, Validators.required],
			numeroExterior: [null, Validators.required],
			fotografiaRegsitro: [null, Validators.required],
			actaDeNacimiento: [null, Validators.required],
			curpArchivo: [null, Validators.required],
			comprobanteDomicilio: [null, Validators.required],
			idPlantel: [null],
			plantel: [null],
			idCarrera: [null],
			carrera: [null]
		}, {
			validators: [Validation.match('password', 'passwordComfirm')]
		}
		);
		this.filtredEstados = this.form.controls['estado'].valueChanges.pipe(
			startWith(''),
			map(value => this._filter_estados(value || ''))
		);

	}
	mostrar() {
		console.log(this.form.getRawValue());
	}
	onAsentamientoChange(event: any) {
		const idAsentamiento = event.option.value;
		const index = this.catalogoAsentamietno.findIndex(e => {
			return e.value == idAsentamiento
		});
		const asentamiento = this.catalogoAsentamietno[index];
		this.form.controls['idAsentamiento'].setValue(asentamiento.value);
		this.form.controls['asentamiento'].setValue(asentamiento.label);
	}

	onPlantelChange(event: any) {
		this.isLoading = true;
		const idPlantel = event.option.value;
		const index = this.catalogoPlanteles.findIndex(p => {
			return p.value == idPlantel
		})
		const plantel = this.catalogoPlanteles[index]
		this.form.controls['plantel'].setValue(plantel.label);
		this.form.controls['idPlantel'].setValue(idPlantel);
		this.catalogoService.getCarreras(idPlantel).subscribe({
			next: (response: ComboDTO[]) =>
				this.catalogoCarreras = response,
			error: (error: HttpErrorResponse) =>
				this._snakeBarService.openSnackBar(error.message, TypeSnakBar.error),
			complete: () =>
				this.isLoading = false
		})
	}

	onCarreraChange(event: any) {

	}

	onEstadoChange(event: any) {

		const idEstado = event.option.value;
		const index = this.catalogoEstados.findIndex(e => {
			return e.value == idEstado
		});
		const estado = this.catalogoEstados[index]
		this.form.controls['idEstado'].setValue(estado.value);
		this.form.controls['estado'].setValue(estado.label);
		this.isLoading = true
		this.catalogoService.getMunicipios(idEstado)
			.subscribe({
				next: (response: ComboDTO[]) => {
					this.catalgoMunicipios = response
					this.filtredMunicipios = this.form.controls['municipio'].valueChanges.pipe(
						startWith(''),
						map(value =>
							this._filter_Municipios(value || '')
						)
					);
				},
				error: (error: HttpErrorResponse) =>
					this._snakeBarService.openSnackBar(error.message, TypeSnakBar.error),
				complete: () =>
					this.isLoading = false
			});
		if (this.form.controls['idPerfil'] != null) {
			this.loadPlanteles(this.f['idEstado'].value);
		}
	}



	onMunicipioChange(event: any): void {
		this.isLoading = true
		const idMunicipio = event.option.value;
		const index = this.catalgoMunicipios.findIndex(e => {
			return e.value == idMunicipio
		});
		const municipio = this.catalgoMunicipios[index];
		this.form.controls['municipio'].setValue(municipio.label);
		this.form.controls['idMunicipio'].setValue(municipio.value);
		this.catalogoService.getAsentamiento(idMunicipio).subscribe({
			next: ((response: ComboDTO[]) => {
				this.catalogoAsentamietno = response;
				this.filtredAsentaminetos = this.form.controls['asentamiento'].valueChanges.pipe(
					startWith(''),
					map(value =>
						this._filter_Asentaminetos(value || '')
					)
				);
			}),
			error: (error: HttpErrorResponse) =>
				this._snakeBarService.openSnackBar(error.message, TypeSnakBar.error)
			, complete: () =>
				this.isLoading = false
		},)
	}

	onPerfilChange(): void {
		const idPerfil = this.form.controls['idPerfil'].value;
		if (idPerfil != 1) {
			const idEstado = this.form.controls['idEstado'].value;
			console.log(idEstado)
			if (idEstado != null) {
				this.loadPlanteles(idEstado);
			} else {
				this.form.controls['estado'].markAsTouched();
				this.form.controls['estado'].setErrors({ required: true })
			}
		}
	}

	private loadPlanteles(idEstado: any): void {
		this.catalogoService.getPlanteles(idEstado).subscribe((response: ComboDTO[]) => {
			this.catalogoPlanteles = response;
			this.filtredPlanteles = this.form.controls['plantel'].valueChanges.pipe(
				startWith(''),
				map(value => this._filter_Planteles(value || ''))
			)
		}, (error: HttpErrorResponse) => {
			console.log(error.message);
		}, () => this.isLoading = false)
	}
	private guardarUsuario(pFormData: UsuarioDTO, pFotoRegistro: File, pCurp: File, pActaNacimiento: File, pComprobante: File): void {
		this.isAvalibleNombreUsuario = true;
		this.isAvalibleNombreUsuario = true;
		this.form.controls['correo'].setErrors({ 'emailAvalibleError': null });
		this.form.controls['nombreUsuario'].setErrors({ 'usernameAvalibleError': null });
		this.isLoading = true;
		this.usuarioService.guardar(pFormData, pFotoRegistro, pCurp, pActaNacimiento, pComprobante).subscribe(
			{
				next: () => {
					Swal.fire({
						title: 'USUARIO GUARDADO',
						text: `El Usuario se dio de alta correctamente.`,
						icon: 'success',
						confirmButtonText: 'Capturar Nuevo Usuario',
						showCancelButton: true,
						cancelButtonText: 'Salir'
					}).then(res => {
						if (res.isConfirmed) {
							this.form.reset();
						} else {
							this.router.navigate(['../'], { relativeTo: this.route });
						}
					})
				},
				error: (error: HttpErrorResponse) =>
					this._snakeBarService.openSnackBar(error.message, TypeSnakBar.error),
				complete: () =>
					this.isLoading = false


			}
		)
	}


	guardar(): void {
		const fotoRegistro = this.form.controls['fotografiaRegsitro'].value;
		const curp = this.form.controls['curpArchivo'].value;
		const comprobante = this.form.controls['comprobanteDomicilio'].value;
		const actaNacimineto = this.form.controls['actaDeNacimiento'].value;
		console.log({ fotoRegistro }, { curp })
		if (this.form.valid) {
			const formData: UsuarioDTO = this.form.getRawValue();
			this.isLoading = true;
			this.usuarioService.validarUsuario(formData.nombreUsuario, formData.correo).subscribe({
				next: (response: any) => {
					if (response.disponible) {

						this.guardarUsuario(formData, fotoRegistro.file, curp.file, actaNacimineto.file, comprobante.file);

					} else {
						this.writeError(response)
					}
				},
				error: (error: HttpErrorResponse) =>
					this._snakeBarService.openSnackBar(error.message, TypeSnakBar.error),
				complete: () =>
					this.isLoading = false

			}
			)
		}
	}
	writeError(response: any): void {
		this.isAvalibleCorreo = response.isCorreoDisponible;
		this.isAvalibleNombreUsuario = response.isUsernameDisponible;
		if (!this.isAvalibleCorreo) {

			this.form.controls['correo'].setErrors({ 'emailAvalibleError': true })
		}
		if (!this.isAvalibleNombreUsuario) {
			this.form.controls['nombreUsuario'].setErrors({ 'usernameAvalibleError': true })

			this.form.controls['correo'].setErrors({ 'emailAvalibleError': true });
		}
		if (!this.isAvalibleNombreUsuario) {
			this.form.controls['nombreUsuario'].setErrors({ 'usernameAvalibleError': true });
		}
		this._snakeBarService.openSnackBar('El nombre de usuario o  correo no esta disponible', TypeSnakBar.error);
	}
	onGeneroChange() {
		const genero = this.form.controls['genero'].value;
		switch (genero) {
			case '3':
				this.form.controls['desGenero'].addValidators(Validators.required);
				this.form.controls['desGenero'].setValue('');
				this.form.controls['desGenero'].enable();
				break;
			default:
				const index = this.catalogoGenero.findIndex(g => {
					return g.value == genero;
				});

				this.form.controls['desGenero'].setValue(this.catalogoGenero[index].label);
				this.form.controls['desGenero'].disable();
				break;
		}
	}


	calcularEdad(event: MatDatepickerInputEvent<any>) {
		const fechaNacimiento = moment(event.value);
		const fechaActual = moment(new Date());
		const diferencia = fechaActual.diff(fechaNacimiento, 'years');
		this.form.controls['edad'].setValue(diferencia);
	}

	validarPassword() {
		const actualPassword = this.form.controls['password'].value;

	}

	private _filter_estados(value: string): ComboDTO[] {
		return this.catalogoEstados.filter(option => option.label.toLowerCase().includes(value.toLowerCase()));
	}

	private _filter_Municipios(value: string): ComboDTO[] {
		return this.catalgoMunicipios.filter((option => option.label.toLowerCase().includes(value.toLowerCase())));
	}

	private _filter_Asentaminetos(value: string): ComboDTO[] {
		return this.catalogoAsentamietno.filter((option => option.label.toLowerCase().includes(value.toLowerCase())));
	}

	private _filter_Planteles(value: string): ComboDTO[] {
		return this.catalogoPlanteles.filter((option) => option.label.toLowerCase().includes(value.toLowerCase()));
	}

	get f(): { [key: string]: AbstractControl } {
		return this.form.controls;
	}

}
