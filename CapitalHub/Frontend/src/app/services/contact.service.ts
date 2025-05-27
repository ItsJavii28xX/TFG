// src/app/services/contact.service.ts
import { Injectable }        from '@angular/core';
import { HttpClient }        from '@angular/common/http';
import { Observable, of }    from 'rxjs';
import { map, catchError, endWith }   from 'rxjs/operators';
import { environment }       from '../../environments/environment';
import { Console } from 'console';

export interface Contact {
  id_contacto: number;
  id_usuario: number;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  imagen_perfil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Busca cualquier usuario de la app por email */
  findUserByEmail(email: string): Observable<Contact|undefined> {
    const enc = encodeURIComponent(email);
    return this.http
      .get<Contact>(`${this.apiUrl}/usuarios/email/${enc}`)
      .pipe(
        // si status!==200 o 404, capturamos y devolvemos undefined
        catchError(() => of(undefined))
      );
  }

  /** (Opcional) si sigues usando contactos locales */
  getAllContacts(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/usuarios/${userId}/contactos`);
  }
}
