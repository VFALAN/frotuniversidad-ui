import { ComboDTO } from '../model/combo-dto';
export function filterComboDTO(pValue: string, array: ComboDTO[]): ComboDTO[] {
	return array.filter((option) => option.label.toLowerCase().includes(pValue.toLowerCase()));
}
