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

  private apiUrl = environment.apiUrl;

  /** Trae todos los gastos de un grupo */
  getByGroup(grupoId: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(
      `${this.apiUrl}/grupos/${grupoId}/gastos`
    );
  }

  constructor(private http: HttpClient) {}
  
}
