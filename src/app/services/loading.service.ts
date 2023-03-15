import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	_loading: boolean = false;

	constructor() { }

	setLoading(pLoading: boolean): void {
		this._loading = pLoading;
	}
	getLoading(): boolean {

		return this._loading;
	}
}
