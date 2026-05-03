import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export enum EstadoType {
  EN_PROCESO = 'En proceso',
  TERMINADO = 'Terminado',
  DECLARADO = 'Declarado',
  PARA_COBRO = 'Para cobro',
  COBRADO = 'Cobrado',
  ARCHIVO = 'Archivo',
  INACTIVO = 'Inactivo'
}

export interface Tramite {
  id: string;
  empresaId: string;
  empresa?: { nombre: string };
  estado: EstadoType;
  monto: number;
  fechaCreacion: Date;
  updatedAt: Date;
}

export interface CreateTramiteDto {
  empresaId: string;
  monto: number;
  estado?: EstadoType;
}

export interface UpdateTramiteDto {
  estado?: EstadoType;
  monto?: number;
}

export interface TramiteResponse {
  data: Tramite[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tramite`;

  getAll(page: number = 1, limit: number = 10, fecha?: Date): Observable<TramiteResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (fecha) {
      params = params.set('fecha', fecha.toString());
    }

    return this.http.get<TramiteResponse>(this.apiUrl, { params, withCredentials: true });
  }

  getById(id: string): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: CreateTramiteDto): Observable<Tramite> {
    return this.http.post<Tramite>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: string, data: UpdateTramiteDto): Observable<Tramite> {
    return this.http.patch<Tramite>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}