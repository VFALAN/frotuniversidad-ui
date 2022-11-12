import {GeneralServiceCrud} from "./general-service-crud";
import {Observable} from "rxjs";
import {PageObject} from "../../model/page-object";
import {HttpClient} from "@angular/common/http";

export abstract class BaseService<E, D,T> implements GeneralServiceCrud<E, D,T> {

  constructor(protected _http: HttpClient, protected _base: string) {
  }

  delete(id: any): Observable<any> {
    return this._http.delete(`${this._base}/${id}`)
  }

  findById(id: any): Observable<E> {
    return this._http.get<E>(`${this._base}/${id}`);
  }

  list(page: any, size: any): Observable<PageObject<T>> {
    const opt = {
      params: {
        page, size
      }
    }
    return this._http.get<PageObject<T>>(this._base , opt)
  }

  listWhitOrder(page: any, size: any, column: string, order: string): Observable<PageObject<T>> {
    const opt = {
      params: {
        page, size, column, order
      }
    }
    return this._http.get<PageObject<T>>(this._base,opt)
  }

  save(dto: D): Observable<E> {
    return this._http.post<E>(this._base, dto);
  }

  update(dto: any, id: any): Observable<E> {
    return this._http.put<E>(this._base, dto);
  }
}
