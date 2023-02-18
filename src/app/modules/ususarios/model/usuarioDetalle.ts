export interface UsuarioDetallerDTO {
	idUsuario: number;
	nombre: string;
	apellidoMaterno: string;
	apellidoPaterno: string;
	fechaNacimiento: string;
	edad: number;
	correo:string;
	nombreUsuario:string
	genero: number;
	desGenero: string;
	curp: string;
	matricula: string;
	idPerfil: number;
	perfil: string;
	idEstatus: number;
	estatus: string;
	calle: string;
	desFachada: string;
	numeroExterior: string;
	numeroInterior: string;
	idAsentamiento: number;
	asentamiento: string;
	idMunicipio: number;
	municipio: string;
	idEstado: number;
	estado: string;
	idPlantel: number;
	plantel: string;
	idCarrera: string;
	carrera: string;
	nombreFotografiaRegistro: string;
	rutaFotografiaRegistro: string;
	idFotografiaRegistro: number;
	nombreCurp: string
	rutaCurp: string
	idCurp: number
	nombreActa: string;
	rutaActa: string;
	idActa: number;
	nombreComprobante: string;
	rutaComprobante: string;
	idComprobante: number
}
