export class FileEvidence {
	file!: File | null;
	nombre!: string;
	path!: string;
	id!: number;
	extencion!: string;
	data!: Buffer;
	downloadUrl!: string;
	tipoArchivo!: string;
	type!: string;
	isDropeedFile: boolean = false;
	mineType!: string;
	idTipoArchivo!: number;
	constructor() { /* TODO document why this constructor is empty */ }

}
