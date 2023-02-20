import { ComboDTO } from "../model/combo-dto";

export const CATALOGO_ESTATUS: ComboDTO[] = [
	{
		label: 'ACTIVO',
		value: '1'
	},
	{
		label: 'INACTIVO',
		value: '2'
	}];
export const CATALOGO_PERFILES: ComboDTO[] = [
	{
		label: 'JEFE DE CARRERA',
		value: '4'
	},
	{
		label: 'DOCENTE',
		value: '3'
	},
	{
		label: 'CONTROL ESCOLAR',
		value: '5'
	},
	{
		label: 'ALUMNO',
		value: '2'
	},
	{
		label: 'ADMINISTRADOR',
		value: '1'
	}
];
export const CATALOGO_GENERO: ComboDTO[] = [
	{
		label: 'MASCULINO',
		value: '1'
	},
	{
		label: 'FEMENINO',
		value: '2'
	},
	{
		label: 'OTRO',
		value: '3'
	}
];

export const CATALOGO_TIPO_ARCHIVO: ComboDTO[] = [
	{
		value: '1',
		label: 'Fotografia Registro'
	}, {
		value: '2',
		label: 'Curp'
	}, {
		value: '3',
		label: 'Acta De Nacimiento'
	}, {
		value: '4',
		label: 'Comprobante De Domicilio'
	},
	{
		value: '5',
		label: 'Comprobante De Pago De Inscripción'
	}
]
