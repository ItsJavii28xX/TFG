// src/app/services/contact.service.ts
import { Injectable }        from '@angular/core';
import { HttpClient }        from '@angular/common/http';
import { Observable, of }    from 'rxjs';
import { catchError }   from 'rxjs/operators';
import { environment }       from '../../environments/environment';

export interface Contact {
  id_contacto: number;
  id_usuario: number;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  imagen_perfil?: string;
}

export interface Contacto {
  id_contacto: number;
  nombre: string;
  email?: string;
  telefono?: string;
  id_usuario_propietario: number;
  id_usuario_contacto: number;
}

export interface ContactoCrear {
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  imagen_perfil?: string;
  id_usuario_contacto: number;
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
        catchError(() => of(undefined))
      );
  }

  getAllContacts(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/usuarios/${userId}/contactos`);
  }

    getAllContactos(userId: number): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`${this.apiUrl}/usuarios/${userId}/contactos`);
  }

  getMembersByGroup(grupoId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(
      `${this.apiUrl}/grupos/${grupoId}/usuarios`
    );
  }


  addContact(
    userId: number,
    contact: ContactoCrear
  ): Observable<ContactoCrear> {
    return this.http.post<ContactoCrear>(
      `${this.apiUrl}/usuarios/${userId}/contactos`,
      contact
    );
  }

}
