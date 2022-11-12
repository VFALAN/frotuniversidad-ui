import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ComboDTO} from "../../../../model/combo-dto";
import {CatalogoEstadosService} from "../../../../services/catalogo-estados.service";
import {UsuarioService} from "../../services/usuario.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CATALOGO_ESTATUS, CATALOGO_GENERO, CATALOGO_PERFILES} from "../../../../utils/Catalogos";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {map, Observable, startWith} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import Validation from "../../../../utils/Validation";
import Swal from 'sweetalert2'
import {UsuarioDTO} from "../../model/usuario-dto";

@Component({
	selector: 'app-alta-usuario',
	templateUrl: './alta-usuario.component.html',
	styleUrls: ['./alta-usuario.component.sass']
})
export class AltaUsuarioComponent implements OnInit {
	isLoading = false;
	startDate = new Date(1970, 0, 1);
	hidePassword = false;
	hideConfirmPasswod = false;
	isAvalibleCorreo: boolean = true;
	isAvalibleNombreUsuario: boolean = true;
	catalogoEstados: ComboDTO[] = [];
	filtredEstados !: Observable<ComboDTO[]>;
	catalgoMunicipios: ComboDTO[] = [];
	filtredMunicipios!: Observable<ComboDTO[]>;
	catalogoAsentamietno: ComboDTO[] = [];
	filtredAsentaminetos!: Observable<ComboDTO[]>;
	catalogoGenero: ComboDTO[] = CATALOGO_GENERO;
	catalogoPerfil: ComboDTO[] = CATALOGO_PERFILES;
	catalogoEstaus: ComboDTO[] = CATALOGO_ESTATUS;
	form !: FormGroup;

	constructor(private route: ActivatedRoute,
				private catalogoService: CatalogoEstadosService,
				private usuarioService: UsuarioService,
				private fb: FormBuilder) {
	}

	ngOnInit(): void {
		this.catalogoEstados = this.route.snapshot.data['respuesta'];
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
				estado: [null],
				idMunicipio: [null, Validators.required],
				municipio: [null],
				idAsentamiento: [null, Validators.required],
				asentamiento: [null],
				folio: [null, Validators.required],
				matricula: [null, Validators.required],
				desGenero: [{value: null, disabled: true}, Validators.required],
				genero: [null, Validators.required],
				edad: [{value: null, disabled: true}, Validators.required],
				fechaNacimiento: [null, Validators.required],
				calle: [null, Validators.required],
				desFachada: [null, Validators.required],
				numeroInterior: [null, Validators.required],
				numeroExterior: [null, Validators.required],
				file: [null, Validators.required]
			}, {

				validators: [Validation.match('password', 'passwordComfirm')]
			}
		);
		this.filtredEstados = this.form.controls['estado'].valueChanges.pipe(
			startWith(''),
			map(value => this._filter_estados(value || ''))
		);

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

	onEstadoChange(event: any) {
		this.isLoading = true
		const idEstado = event.option.value;
		const index = this.catalogoEstados.findIndex(e => {
			return e.value == idEstado
		});
		const estado = this.catalogoEstados[index]
		this.form.controls['idEstado'].setValue(estado.value);
		this.form.controls['estado'].setValue(estado.label);
		this.catalogoService.getMunicipios(idEstado).subscribe((response) => {
			this.catalgoMunicipios = response
			this.filtredMunicipios = this.form.controls['municipio'].valueChanges.pipe(
				startWith(''),
				map(value => this._filter_Municipios(value || ''))
			);
		}, error => {
			console.log(error.message)
		}, () => {
			this.isLoading = false
		})
	}

	onMunicipioChange(event: any) {
		this.isLoading = true
		const idMunicipio = event.option.value;
		const index = this.catalgoMunicipios.findIndex(e => {
			return e.value == idMunicipio
		});
		const municipio = this.catalgoMunicipios[index];
		this.form.controls['municipio'].setValue(municipio.label);
		this.form.controls['idMunicipio'].setValue(municipio.value);
		this.catalogoService.getAsentamiento(idMunicipio).subscribe(((response: ComboDTO[]) => {
			this.catalogoAsentamietno = response;
			this.filtredAsentaminetos = this.form.controls['asentamiento'].valueChanges.pipe(
				startWith(''),
				map(value => this._filter_Asentaminetos(value || ''))
			);
		}), (error: HttpErrorResponse) => {
			console.log(error.message)
		}, () => this.isLoading = false)
	}

	guardar() {
		const file:File = this.form.controls['file'].value;
		console.log(file);
		if (this.form.valid) {
			const formData:UsuarioDTO = this.form.getRawValue();
			this.isLoading = true
			this.usuarioService.validarUsuario(formData.nombreUsuario, formData.correo).subscribe(
				(response: any) => {
					if (response.disponible) {
						this.isAvalibleNombreUsuario = true;
						this.isAvalibleNombreUsuario = true;
						this.form.controls['correo'].setErrors({'emailAvalibleError': null})
						this.form.controls['nombreUsuario'].setErrors({'usernameAvalibleError': null})
						this.isLoading = true
						this.usuarioService.guardar(formData,file).subscribe(
							(response: any) => {
								Swal.fire({
									title: 'USUARIO GUARDADO',
									text: 'El Usuario se Dio de alta Correotamente',
									icon: 'success'
								})
							}, (error: HttpErrorResponse) => {
								Swal.fire({
									title: 'USUARIO GUARDADO',
									text: error.message
									,
									icon: 'error'
								})
							}, () => {
								this.isLoading = false
							}
						)
					} else {
						this.isAvalibleCorreo = response.isCorreoDisponible;
						this.isAvalibleNombreUsuario = response.isUsernameDisponible;
						if (!this.isAvalibleCorreo) {
							this.form.controls['correo'].setErrors({'emailAvalibleError': true})
						}
						if (!this.isAvalibleNombreUsuario) {
							this.form.controls['nombreUsuario'].setErrors({'usernameAvalibleError': true})
						}
					}
				}, (error: HttpErrorResponse) => {
					console.log(error.message)
				}, () => this.isLoading = false)
		}
	}

	onGeneroChange() {
		const genero = this.form.controls['genero'].value;
		console.log(genero)
		switch (genero) {
			case '3' :
				this.form.controls['desGenero'].addValidators(Validators.required);
				this.form.controls['desGenero'].setValue('');
				this.form.controls['desGenero'].enable();
				break;
			default :
				const index = this.catalogoGenero.findIndex(g => {
					return g.value == genero
				});

				this.form.controls['desGenero'].setValue(this.catalogoGenero[index].label);
				this.form.controls['desGenero'].disable();
				break;
		}
	}

	generarUsernameAleatorio() {
	}

	generarpasswordAleatorio() {
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
		return this.catalogoEstados.filter(option => option.label.toLowerCase().includes(value.toLowerCase()))
	}

	private _filter_Municipios(value: string): ComboDTO[] {
		return this.catalgoMunicipios.filter((option => option.label.toLowerCase().includes(value.toLowerCase())))
	}

	private _filter_Asentaminetos(value: string): ComboDTO[] {
		return this.catalogoAsentamietno.filter((option => option.label.toLowerCase().includes(value.toLowerCase())))
	}

	get f(): { [key: string]: AbstractControl } {
		return this.form.controls;
	}
}
