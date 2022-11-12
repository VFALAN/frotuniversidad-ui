import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

/**
 *
 */
export default class Validation {
	static match(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkOut = controls.get(checkControlName);
			if (checkOut?.errors && !checkOut.errors['matching']) {
				return null;
			}
			if (control?.value !== checkOut?.value) {
				controls.get(checkControlName)?.setErrors({matching: true});
				return {matching: true};
			} else {
				return null;
			}
		}
	}

	static containUpper(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const exp: RegExp = new RegExp('[A-Z]');
			const contain = exp.test(control.value);
			return contain ? null : {containUpper: true}

		}
	}
	static containLoweer() : ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const exp: RegExp = new RegExp('[a-z]');
			const contain = exp.test(control.value);
			return contain ? null : {containLoweer: true}

		}
	}
	static containNumber() : ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const exp: RegExp = new RegExp('[0-9]');
			const contain = exp.test(control.value);
			return contain ? null : {containNumber: true}

		}
	}
	static containSpecialCaracter():ValidatorFn{
		return (control:AbstractControl):ValidationErrors|null=>{
			const caracteresPermitidos = ['|','°','!','#','$','%','&','/','(',')','=','?','¡','¿','{','}','/','*','-','+','.',',',':',';','-','_','@']
			let hasCaracter:boolean = false
			if(control.value!=null){
				for(let c of caracteresPermitidos){
					if(control.value.includes(c)){
						hasCaracter = true;
						break;
					}
				}
			}
			return hasCaracter ? null :{containSpecialCaracter:true}
		}
	}

	static emailAvalible(isAvalible:boolean):ValidatorFn{
		return (control : AbstractControl):ValidationErrors | null =>{
			return isAvalible ? null : {emailAvalibleError : true}
		}
	}
	static usernameAvalible(isAvalible:boolean):ValidatorFn{
		return (control : AbstractControl):ValidationErrors | null =>{
			return isAvalible ? null : {usernameAvalibleError : true}
		}
	}
}
