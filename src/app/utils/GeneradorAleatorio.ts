const MINUSCULAS: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const MAYUSCULAS: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const NUMEROS: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SIMBOLOS: string[] = ["!", "#", "$", "%", "&", "/", "(", ")", "=", "*", "-", "+", "{", "}", ",", ".", "-", "_", ""] //"!+-=&()#$%/*";
export function GENERAR_PASSWORD(longitud: number): string {
  let password: string = '';
  for (let i = 0; i < longitud; i++) {
    let caracter='';
    const arreglo = Math.floor(Math.random() * 5);
    switch (arreglo) {
      case 1 :
        caracter = obtenerCaracter(MINUSCULAS);
        break;
      case 2:
        caracter = obtenerCaracter(MAYUSCULAS);
        break;
      case 3:
        caracter = obtenerCaracter(NUMEROS);
        break;
      case 4:
        caracter = obtenerCaracter(SIMBOLOS);
        break;
      default:
        caracter = obtenerCaracter(MINUSCULAS);
        break;
    }
    password = password.concat(caracter);
  }
  return password;
}

function obtenerCaracter(array: string[]) {
  const posicion = Math.floor(Math.random() * array.length);
  return array[posicion];
}
