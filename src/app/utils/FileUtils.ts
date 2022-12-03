export function baseUrlDataToFile(base: string, name: string, type: string) {
	const arr = base.split(',');
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], name, {type: type});
}
