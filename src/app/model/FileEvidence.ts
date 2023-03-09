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
	mineType!: string;
	constructor() { /* TODO document why this constructor is empty */  }

}
