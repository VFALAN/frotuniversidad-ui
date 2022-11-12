import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LoginDTO} from "../models/login-dto";
import {Observable} from "rxjs";

@Injectable()
export class AuthetificationService {
  protected URL = `${environment.baseUrl}${environment.apis.auth}`;

  constructor(private _http: HttpClient) {
  }

  login(login: LoginDTO): Observable<any> {
    return this._http.post(`${this.URL}authentification/login`, login , {responseType : "text"} );
  }
}
