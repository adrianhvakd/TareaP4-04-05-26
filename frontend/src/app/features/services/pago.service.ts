import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export enum MetodoPagoType {
  QR = 'QR',
  EFECTIVO = 'Efectivo'
}

export interface Pago {
  id: string;
  tramiteId: string;
  tramite?: { id: string; empresa?: { nombre: string }; monto: number; estado: string };
  montoPagado: number;
  metodoPago: MetodoPagoType;
  comprobante: string;
  fechaPago: Date;
}

export interface CreatePagoDto {
  tramiteId: string;
  montoPagado: number;
  metodoPago: MetodoPagoType;
  comprobante: string;
}

export interface UpdatePagoDto {
  montoPagado?: number;
  metodoPago?: MetodoPagoType;
  comprobante?: string;
}

export interface PagoResponse {
  data: Pago[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/pago`;

  getAll(page: number = 1, limit: number = 10, tramiteId?: string): Observable<PagoResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (tramiteId) {
      params = params.set('tramiteId', tramiteId);
    }

    return this.http.get<PagoResponse>(this.apiUrl, { params, withCredentials: true });
  }

  getById(id: string): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: CreatePagoDto): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: string, data: UpdatePagoDto): Observable<Pago> {
    return this.http.patch<Pago>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}