import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";

export interface Usuario {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioDto {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UpdateUsuarioDto {
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface UsuarioResponse {
  data: Usuario[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuario`;

  getAll(page: number = 1, limit: number = 10, username?: string): Observable<UsuarioResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (username) {
      params = params.set('username', username);
    }

    return this.http.get<UsuarioResponse>(this.apiUrl, { params, withCredentials: true });
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: string, data: UpdateUsuarioDto): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}