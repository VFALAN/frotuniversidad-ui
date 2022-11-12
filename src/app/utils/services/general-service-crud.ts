import {Observable} from "rxjs";
import {PageObject} from "../../model/page-object";

export interface GeneralServiceCrud<T,D,E> {
  save(dto: D): Observable<T>;

  findById(id: any): Observable<T>;

  list(page: any, size: any): Observable<PageObject<E>>;

  listWhitOrder(page: any, size: any, column: string, order: string): Observable<PageObject<E>>

  update(dto: any, id: any): Observable<T>;

  delete(id: any): Observable<any>;

}
