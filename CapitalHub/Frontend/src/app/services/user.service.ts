import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, tap } from 'rxjs';
import { User } from './auth.service';

export interface RegisterDto {
  nombre: string;
  apellidos: string;
  email: string;
  contraseña: string;
  telefono: string;
  imagen_perfil?: string;
}

export interface UserDto {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  imagen_perfil?: string;
  oauth_provider?: string;
  oauth_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;
  private _refresh$ = new Subject<void>();
  public refresh$ = this._refresh$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Registra un usuario nuevo enviando JSON.
   * imagen_perfil es un data URL Base64 opcional.
   */
  register(data: RegisterDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/usuarios`, data);
  }

  /**
   * Obtiene los datos de un usuario por ID.
   */
  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/usuarios/${id}`);
  }

  /**
   * Actualiza datos de un usuario existente.
   * data puede ser parcial; p.ej. { telefono, imagen_perfil, etc. }
   */
  update(id: number, data: Partial<RegisterDto>): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/usuarios/${id}`, data);
  }

  verifyPassword(id: number, currentPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/usuarios/${id}/verify-password`, { password: currentPassword });
  }

  deleteUserCascade(userIds: number[]): Observable<UserDto> {
    return this.http
      .request<UserDto>(
        'delete',
        `${this.apiUrl}/usuarioCascada`,
        { body: { ids: userIds } }
      )
      .pipe(
        tap(() => this._refresh$.next())
      );
  }

}