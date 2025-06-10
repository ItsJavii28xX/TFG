import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Budget {
  id_presupuesto: number;
  nombre:         string;
  cantidad:       number;
  descripcion:    string;
  fecha_inicio:   string;
  fecha_fin:      string;
}

export interface BudgetDto {
  nombre:       string;
  cantidad:     number;
  descripcion?: string;
  fechaInicio:  Date;
  fechaFin:     Date;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Crea un presupuesto dentro de un grupo */
  create(grupoId: number, data: BudgetDto): Observable<Budget> {
    // el backend espera fecha_creacion y devuelve fecha_inicio/fin según el modelo
    return this.http.post<Budget>(
      `${this.apiUrl}/grupos/${grupoId}/presupuestos`,
      {
        nombre:        data.nombre,
        cantidad:      data.cantidad,
        descripcion:   data.descripcion,
        fecha_inicio:  data.fechaInicio,
        fecha_fin:     data.fechaFin
      }
    );
  }

  /** DELETE /presupuestos/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/presupuestos/${id}`
    );
  }

  /** PUT /presupuestos/:id */
  update(id: number, data: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(
      `${this.apiUrl}/presupuestos/${id}`,
      data
    );
  }

  getByGroup(grupoId: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(
      `${this.apiUrl}/grupos/${grupoId}/presupuestos`
    );
  }

}
