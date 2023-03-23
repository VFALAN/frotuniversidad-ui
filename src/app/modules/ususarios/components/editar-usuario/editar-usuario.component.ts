import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { SnackService } from '../../../../services/snack.service';
import { FileEvidence } from '../../../../model/FileEvidence';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioDetallerDTO } from '../../model/usuarioDetalle';
import Validation from '../../../../utils/Validation';
import { ComboDTO } from '../../../../model/combo-dto';
import { CATALOGO_GENERO, CATALOGO_PERFILES, CATALOGO_ESTATUS } from '../../../../utils/Catalogos';
import { Observable, startWith, map } from 'rxjs';
import { CatalogoEstadosService } from '../../../../services/catalogo-estados.service';
import { filterComboDTO } from '../../../../utils/FilterUtils';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { TypeSnakBar } from '../../../../utils/TypeSnakBar.enum';
import { UsuarioDTO } from '../../model/usuario-dto';

@Component({
	selector: 'app-editar-usuario',
	templateUrl: './editar-usuario.component.html',
	styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
	readonly _IdFotoRegistro = 1;
	readonly _IdCurp = 2;
	readonly _IdActaNacimineto = 3;
	readonly _IdComprobante = 4;
	form !: FormGroup;
	formArchivos!: FormGroup;
	startDate = new Date(1980, 0, 1);
	hidePassword = true;
	hideConfirmPasswod = true;
	catalogoEstados: ComboDTO[] = [];
	catalogoMunicipio: ComboDTO[] = [];
	catalogoAsentamientos: ComboDTO[] = [];
	catalogoPlanteles: ComboDTO[] = [];
	catalogoGenero: ComboDTO[] = CATALOGO_GENERO;
	catalogoPerfil: ComboDTO[] = CATALOGO_PERFILES;
	catalogoEstaus: ComboDTO[] = CATALOGO_ESTATUS;
	catalogoCarreras: ComboDTO[] = [];
	filtredEstados !: Observable<ComboDTO[]>;
	filtredAsentamientos !: Observable<ComboDTO[]>;
	filtredMunicipios !: Observable<ComboDTO[]>;
	filtredPlanteles !: Observable<ComboDTO[]>;
	correoOriginal!: string;
	constructor(
		private _UsuarioService: UsuarioService,
		private _ActivatedRoute: ActivatedRoute,
		private _CatalogoService: CatalogoEstadosService,
		private _SnackService: SnackService,
		private _Router: Router,
		private _fb: FormBuilder
	) { }

	ngOnInit(): void {
		const { usuario, archivos, estados } = this._ActivatedRoute.snapshot.data['data'];
		const fotoRegistro = this.obtenerFileEvidence(this._IdFotoRegistro, archivos);
		const curp = this.obtenerFileEvidence(this._IdCurp, archivos);
		const actaNacimiento = this.obtenerFileEvidence(this._IdActaNacimineto, archivos);
		const comprobante = this.obtenerFileEvidence(this._IdComprobante, archivos);
		this.catalogoEstados = estados;
		this.initForm(usuario, fotoRegistro, curp, actaNacimiento, comprobante);

	}
	private preloadData(): void {
		const idPlantel = this.f['idPlantel'].value;
		const idEstado = this.f['idEstado'].value;
		const idMunicipio = this.f['idMunicipio'].value;
		if (idPlantel != null) {
			this._CatalogoService.getCarreras(idPlantel).subscribe({
				next: (response: ComboDTO[]) =>
					this.catalogoCarreras = response
			});
		}
		this._CatalogoService.getMunicipios(idEstado).subscribe({
			next: (response: ComboDTO[]) => {
				this.catalogoMunicipio = response;
				this.filtredMunicipios = this.f['municipio'].valueChanges.pipe(
					startWith(''),
					map(v =>
						filterComboDTO(v || '', this.catalogoMunicipio)
					)
				);
			}
		});
		this._CatalogoService.getAsentamiento(idMunicipio).subscribe({
			next: (response: ComboDTO[]) => {
				this.catalogoAsentamientos = response;
				this.filtredAsentamientos = this.f['asentamiento'].valueChanges.pipe(
					startWith(''), map(v =>
						filterComboDTO(v || '', this.catalogoAsentamientos))
				)
			}
		});



	}


	onMunicipioChange($event: any) {
		const idMunicipio = this.form.controls['idMunicipio'].value;
		this._CatalogoService.getAsentamiento(idMunicipio).subscribe({
			next: (response: ComboDTO[]) => {
				this.catalogoAsentamientos = response;
				this.form.controls['municipio'].valueChanges.pipe(
					startWith(''), map(v => filterComboDTO(v || '', this.catalogoAsentamientos))
				);
			}
		})
	}
	onAsentamientoChange($event: any) {
		this.resetDireccion()
	}

	onPerfilChange() {
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

	onPlantelChange(event: any): void {
		const idPlantel = event.option.value;
		const index = this.catalogoPlanteles.findIndex(p => {
			return p.value == idPlantel
		});
		const plantel = this.catalogoPlanteles[index]
		this.form.controls['plantel'].setValue(plantel.label);
		this.form.controls['idPlantel'].setValue(idPlantel);
		this._CatalogoService.getCarreras(idPlantel).subscribe({
			next: (response: ComboDTO[]) =>
				this.catalogoCarreras = response
		});
	}
	onEstadoChange(event: any): void {
		const idEstado = event.option.value;
		const index = this.catalogoEstados.findIndex(c => {
			return c.value === idEstado
		});
		const estado = this.catalogoEstados[index];
		this.form.controls['idEstado'].setValue(estado.value);
		this.form.controls['estado'].setValue(estado.label);
		this._CatalogoService.getMunicipios(idEstado).subscribe({
			next: (response: ComboDTO[]) => {
				this.catalogoMunicipio = response;
				this.form.controls['estado'].valueChanges.pipe(
					startWith(''), map(v =>
						filterComboDTO(v || '', this.catalogoMunicipio)
					)
				);
				this.resetMunicipio();
			}
		})
	}
	initForm(dataUsuario: UsuarioDetallerDTO, fotoRegistro: FileEvidence | null, curp: FileEvidence | null, actaNacimiento: FileEvidence | null, comprobante: FileEvidence | null): void {
		console.log({ dataUsuario });
		this.form = this._fb.group({
			idUsuario: [dataUsuario.idUsuario],
			apellidoPaterno: [dataUsuario.apellidoPaterno, Validators.required],
			apellidoMaterno: [dataUsuario.apellidoMaterno, Validators.required],
			nombre: [dataUsuario.nombre, Validators.required],
			correo: [dataUsuario.correo, Validators.required],
			curp: [dataUsuario.curp, Validators.required],
			idEstatus: [dataUsuario.idEstatus, Validators.required],
			estatus: [dataUsuario.estatus, Validators.required],
			idPerfil: [dataUsuario.idPerfil, Validators.required],
			perfil: [dataUsuario.perfil, Validators.required],
			idEstado: [dataUsuario.idEstado, Validators.required],
			estado: [dataUsuario.estado, Validators.required],
			idMunicipio: [dataUsuario.idMunicipio, Validators.required],
			municipio: [dataUsuario.municipio, Validators.required],
			idAsentamiento: [dataUsuario.idAsentamiento, Validators.required],
			asentamiento: [dataUsuario.asentamiento, Validators.required],
			desGenero: [dataUsuario.desGenero, Validators.required],
			genero: [dataUsuario.genero, Validators.required],
			edad: [{ value: dataUsuario.edad, disabled: true }, Validators.required],
			fechaNacimiento: [new Date(dataUsuario.fechaNacimiento), Validators.required],
			nombreUsuario: [{ value: dataUsuario.nombreUsuario, disabled: true }],
			calle: [dataUsuario.calle, Validators.required],
			desFachada: [dataUsuario.desFachada, Validators.required],
			numeroInterior: [dataUsuario.numeroInterior, Validators.required],
			numeroExterior: [dataUsuario.numeroExterior, Validators.required],
			idPlantel: [dataUsuario.idPlantel, Validators.required],
			plantel: [dataUsuario.plantel, Validators.required],
			idCarrera: [dataUsuario.idCarrera, Validators.required],
			carrera: [dataUsuario.carrera, Validators.required],


		});
		this.formArchivos = this._fb.group({
			fotografiaRegsitro: [fotoRegistro, Validators.required],
			actaDeNacimiento: [actaNacimiento, Validators.required],
			curpArchivo: [curp, Validators.required],
			comprobanteDomicilio: [comprobante, Validators.required],
		});

		this.correoOriginal = this.f['correo'].value;
		this.filtredEstados = this.f['estado'].valueChanges.pipe(
			startWith(''),
			map(value => filterComboDTO(value || '', this.catalogoEstados))
		);
		this.preloadData();
	}

	private guardar(): void {
		const usuarioData: UsuarioDTO = this.form.getRawValue() as UsuarioDTO;
		const { curpArchivo, actaDeNacimiento, comprobanteDomicilio, fotografiaRegsitro } = this.formArchivos.getRawValue();
		this._UsuarioService.actualizar(usuarioData,
			fotografiaRegsitro.file, fotografiaRegsitro.id,
			curpArchivo.id, curpArchivo.file,
			actaDeNacimiento.id, actaDeNacimiento.file,
			comprobanteDomicilio.id, comprobanteDomicilio.file
		).subscribe({
			next: () => {
				this._SnackService.openSnackBar('Datos Actualizados', TypeSnakBar.sucess);
				this._Router.navigate(['/usuarios']);
			}
		})

	}
	confimarGuardado(): void {

		Swal.fire({
			title: 'Confirmar Cambios',
			text: 'Desea Guardar los Cambios',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Guardar'
		}).then(res => {
			if (res.isConfirmed) {
				this.validarGuardado();
			}
		})
	}

	private validarGuardado(): void {
		const { nombreUsuario, correo } = this.form.getRawValue();
		if (this.correoOriginal !== correo) {
			this._UsuarioService.validarUsuario(nombreUsuario, correo).subscribe({
				next: (response: any) => {
					if (response.isCorreoDisponible) {
						this.guardar();
					} else {
						this.writeErrors(response);
					}
				}
			})
		} else {
			this.guardar();
		}
	}
	writeErrors(response: any): void {
		if (!response.isCorreoDisponible) {
			this.form.controls['correo'].setErrors({ 'emailAvalibleError': true })
		}
		this._SnackService.openSnackBar('El nombre de usuario o  correo no esta disponible', TypeSnakBar.error);
	}


	compareCombo(v1: ComboDTO, v2: ComboDTO): boolean {
		if (v1 && v2) {
			return v1.value == v2.value;
		}
		return false;
	}


	private obtenerFileEvidence(idTipoArchivo: number, listaArchivos: FileEvidence[]): FileEvidence | null {
		const index = listaArchivos.findIndex(l => {
			return l.idTipoArchivo === idTipoArchivo;
		});
		if (index === -1) {
			return null
		} else {
			return listaArchivos[index];
		}
	}

	calcularEdad(event: MatDatepickerInputEvent<any>): void {
		const fechaNacimiento = moment(event.value);
		const fechaActual = moment(new Date());
		const diferencia = fechaActual.diff(fechaNacimiento, 'years');
		this.form.controls['edad'].setValue(diferencia);
	}
	onGeneroChange(): void {
		const genero = this.form.controls['genero'].value;
		if (genero === '3') {
			this.form.controls['desGenero'].addValidators(Validators.required);
			this.form.controls['desGenero'].setValue('');
			this.form.controls['desGenero'].enable();
		}
		else {
			const index = this.catalogoGenero.findIndex(g => {
				return g.value == genero;
			});

			this.form.controls['desGenero'].setValue(this.catalogoGenero[index].label);
			this.form.controls['desGenero'].disable();
		}
	}

	private resetMunicipio(): void {
		this.f['municipio'].setValue(null);
		this.f['idMunicipio'].setValue(null);
		this.resetAsentamiento();
	}
	private resetAsentamiento(): void {
		this.f['asentamiento'].setValue(null);
		this.f['idAsentamiento'].setValue(null);
		this.resetDireccion();
	}

	private resetDireccion(): void {
		this.f['calle'].setValue(null);
		this.f['numeroExterior'].setValue(null);
		this.f['numeroInterior'].setValue(null);
		this.f['desFachada'].setValue(null);

	}

	private loadPlanteles(idEstado: any): void {
		this._CatalogoService.getPlanteles(idEstado).subscribe({
			next: (response: ComboDTO[]) => {
				this.catalogoPlanteles = response;
				this.filtredPlanteles = this.form.controls['plantel'].valueChanges.pipe(
					startWith(''),
					map(value => filterComboDTO(value || '', this.catalogoPlanteles))
				)
			}
		})
	}
	get f(): { [key: string]: AbstractControl } {
		return this.form.controls;
	}

	get fa(): { [key: string]: AbstractControl } {
		return this.formArchivos.controls;
	}
}
