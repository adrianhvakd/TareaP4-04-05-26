import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Empresa {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmpresaDto {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface UpdateEmpresaDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
}

export interface EmpresaResponse {
  data: Empresa[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/empresa`;

  getAll(page: number = 1, limit: number = 10, nombre?: string): Observable<EmpresaResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    
    if (nombre) {
      params = params.set('nombre', nombre);
    }

    return this.http.get<EmpresaResponse>(this.apiUrl, { params, withCredentials: true });
  }

  getById(id: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: CreateEmpresaDto): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: string, data: UpdateEmpresaDto): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}