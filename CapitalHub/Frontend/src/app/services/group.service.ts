// src/app/services/group.service.ts
import { Injectable }     from '@angular/core';
import { HttpClient }     from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {}

  /** Obtiene todos los grupos */
  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/grupos`);
  }

  /** Crea un grupo */
  create(nombre: string): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/grupos`, { nombre });
  }

  /** Añade un usuario **administrador** al grupo */
  addAdmin(id_usuario: number, id_grupo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios-grupos`, {
      id_usuario,
      id_grupo,
      es_administrador: true
    });
  }

  /** Añade un usuario **normal** al grupo */
  addMember(id_usuario: number, id_grupo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios-grupos`, {
      id_usuario,
      id_grupo,
      es_administrador: false
    });
  }

}
