export function fuctionObtenerIdUsuario(){
	const token = sessionStorage.getItem('user_token');
	if(token){
		const payload = token.split('.')[1]
		const data = JSON.parse(window.atob(payload));
		return data.idUsuario;
	}else{
		return null;
	}
}

