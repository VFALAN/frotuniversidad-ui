import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsuarioDetallerDTO } from '../../model/usuarioDetalle';
import { FileEvidence } from '../../../../model/FileEvidence';
export interface DataFromResolver {
	usuario: any,
	fotoRegistro: any;
	curp: any;
	actaNacimiento: any;
	comprobanteDomicilio: any;
	listaArchivos: any
}
@Component({
	selector: 'app-detalle-usuario',
	templateUrl: './detalle-usuario.component.html',
	styleUrls: ['./detalle-usuario.component.sass']
})

export class DetalleUsuarioComponent implements OnInit {
	form!: FormGroup;
	archivosList: FileEvidence[] = [];
	constructor(private fb: FormBuilder, private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		const data: DataFromResolver = this.route.snapshot.data['data'];
		this.archivosList = data.listaArchivos;
		this.initForm(data.usuario);
	}

	initForm(dataUsuario: UsuarioDetallerDTO): void {
		console.log(dataUsuario)
		this.form = this.fb.group({
			apellidoPaterno: [{ value: dataUsuario.apellidoPaterno, disabled: true }],
			apellidoMaterno: [{ value: dataUsuario.apellidoMaterno, disabled: true }],
			nombre: [{ value: dataUsuario.nombre, disabled: true }],
			correo: [{ value: dataUsuario.correo, disabled: true },],
			nombreUsuario: [{ value: dataUsuario.nombreUsuario, disabled: true }],
			curp: [{ value: dataUsuario.curp, disabled: true }],
			idEstatus: [{ value: dataUsuario.idEstatus, disabled: true }],
			estatus: [{ value: dataUsuario.estatus, disabled: true }],
			idPerfil: [{ value: dataUsuario.idPerfil, disabled: true }],
			perfil: [{ value: dataUsuario.perfil, disabled: true }],
			idEstado: [{ value: dataUsuario.idEstado, disabled: true }],
			estado: [{ value: dataUsuario.estado, disabled: true }],
			idMunicipio: [{ value: dataUsuario.idMunicipio, disabled: true }],
			municipio: [{ value: dataUsuario.municipio, disabled: true }],
			idAsentamiento: [{ value: dataUsuario.idAsentamiento, disabled: true }],
			asentamiento: [{ value: dataUsuario.asentamiento, disabled: true }],
			desGenero: [{ value: dataUsuario.desGenero, disabled: true }],
			genero: [{ value: dataUsuario.genero, disabled: true }],
			edad: [{ value: dataUsuario.edad, disabled: true }],
			fechaNacimiento: [{ value: dataUsuario.fechaNacimiento, disabled: true }],
			calle: [{ value: dataUsuario.calle, disabled: true }],
			desFachada: [{ value: dataUsuario.desFachada, disabled: true }],
			numeroInterior: [{ value: dataUsuario.numeroInterior, disabled: true }],
			numeroExterior: [{ value: dataUsuario.numeroExterior, disabled: true }],
			fotografiaRegsitro: [{ value: dataUsuario.nombreFotografiaRegistro, disabled: true }],
			actaDeNacimiento: [{ value: dataUsuario.nombreActa, disabled: true }],
			curpArchivo: [{ value: dataUsuario.nombreCurp, disabled: true }],
			comprobanteDomicilio: [{ value: dataUsuario.nombreComprobante, disabled: true }],
			idPlantel: [{ value: dataUsuario.idPlantel, disabled: true }],
			plantel: [{ value: dataUsuario.plantel, disabled: true }],
			idCarrera: [{ value: dataUsuario.idCarrera, disabled: true }],
			carrera: [{ value: dataUsuario.carrera, disabled: true }]
		}
		);

	}

	get f(): { [key: string]: AbstractControl } {
		return this.form.controls;
	}


}
