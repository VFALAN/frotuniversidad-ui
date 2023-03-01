export class FileEvidence {
	file!: File | undefined;
	nombre!: string;
	path!: string;
	id!: number;
	extencion!: string;
	data!: Buffer;
	downloadUrl!: string;
	tipoArchivo!: string;
	type!: string;
	isDropeedFile: boolean = false;
	myneType!: string;
	constructor() { }

}
