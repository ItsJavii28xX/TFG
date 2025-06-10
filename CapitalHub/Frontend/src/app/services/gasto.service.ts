import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Gasto {
  id_gasto       : number;
  id_grupo       : number;
  nombre         : string;
  descripcion?   : string;
  estado         : string;
  cantidad       : number;
  fecha_creacion : Date;
}


@Injectable({
  providedIn: 'root'
})
export class GastoService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  /** Trae todos los gastos de un grupo */
  getByGroup(grupoId: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(
      `${this.apiUrl}/grupos/${grupoId}/gastos`
    );
  }

   /** POST /grupos/:idGrupo/gastos */
  create(gasto: Partial<Gasto> & { id_grupo: number }): Observable<Gasto> {
    return this.http.post<Gasto>(
      `${this.apiUrl}/grupos/${gasto.id_grupo}/gastos`,
      gasto
    );
  }

  /** DELETE /gastos/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/gastos/${id}`
    );
  }

  /** PUT /gastos/:id */
  update(id: number, data: Partial<Gasto>): Observable<Gasto> {
    return this.http.put<Gasto>(
      `${this.apiUrl}/gastos/${id}`,
      data
    );
  }

}
