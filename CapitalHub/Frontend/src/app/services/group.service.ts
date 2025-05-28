// src/app/services/group.service.ts
import { Injectable }     from '@angular/core';
import { HttpClient }     from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap }            from 'rxjs/operators';
import { environment }    from '../../environments/environment';

export interface Group {
  id_grupo: number;
  nombre: string;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.apiUrl;
  private _refresh$ = new Subject<void>();
  public refresh$ = this._refresh$.asObservable();

  constructor(private http: HttpClient) {}

  triggerRefresh() {
    this._refresh$.next();
  }

  /** TRAE SOLO LOS GRUPOS de un usuario dado */
  getAll(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/usuarios/${userId}/grupos`);
  }

  /** CREA un grupo y dispara recarga */
  create(nombre: string): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/grupos`, { nombre }).pipe();
  }

  addAdmin(id_usuario: number, id_grupo: number) {
    return this.http.post(`${this.apiUrl}/usuarios-grupos`, {
      id_usuario, id_grupo, es_administrador: true
    });
  }

  addMember(id_usuario: number, id_grupo: number) {
    return this.http.post(`${this.apiUrl}/usuarios-grupos`, {
      id_usuario, id_grupo, es_administrador: false
    });
  }

  /**
   * Elimina en cascada uno o varios grupos: primero borra
   * usuarios-grupos, histórico, gastos y presupuestos, y al final el grupo.
   */
  deleteGroupCascade(groupIds: number[]): Observable<any> {
    return this.http
      .request('delete', `${this.apiUrl}/grupos`, { body: { ids: groupIds } })
      .pipe(
        tap(() => this._refresh$.next())
      );
  }

  update(id_grupo: number, changes: Partial<Pick<Group, 'nombre'>>): Observable<Group> {
    return this.http.put<Group>(
      `${this.apiUrl}/grupos/${id_grupo}`,
      changes
    ).pipe(
      tap(() => this._refresh$.next())
    );
  }

}
