import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Transferencia {
  id?: number;
  numeroPapeleta: string;
  sucursalId: number;
  sucursal: string;
  bancoId: number;
  bancoEmisor: string;
  cuentaBancaria: string;
  fechaDeposito: string;
  valorTotalEfectivo: number;
  usuario?: string;
  observacion?: string;
  servicioFacturado?: string;
  estado: string;
  fechaHora?: string;
}

export interface Sucursal {
  id: number;
  nombre: string;
}

export interface Banco {
  id: number;
  nombre: string;
}

export interface OpcionMenu {
  nombre: string;
  subruta: string;
}

export interface FiltrosTransferencias {
  sucursalId?: number;
  bancoId?: number;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  usuario?: string;
  sucursal?: string;
  servicioFacturado?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface TransferenciasData {
  rows: Transferencia[];
  totalRows: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {
  private apiUrl = `${environment.apiBaseUrl}/api/transfers`;
  private sucursalesUrl = `${environment.apiBaseUrl}/api/sucursales`;
  private bancosUrl = `${environment.apiBaseUrl}/api/bancos`;

  constructor(private http: HttpClient) {}

  buscarTransferencias(filtros: FiltrosTransferencias): Observable<ApiResponse<TransferenciasData>> {
    let params = new HttpParams();
    
    if (filtros.sucursalId) {
      params = params.set('sucursalId', filtros.sucursalId.toString());
    }
    if (filtros.bancoId) {
      params = params.set('bancoId', filtros.bancoId.toString());
    }
    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }
    if (filtros.usuario) {
      params = params.set('usuario', filtros.usuario);
    }
    if (filtros.sucursal) {
      params = params.set('sucursal', filtros.sucursal);
    }
    if (filtros.servicioFacturado) {
      params = params.set('servicioFacturado', filtros.servicioFacturado);
    }
    if (filtros.page) {
      params = params.set('page', filtros.page.toString());
    }
    if (filtros.limit) {
      params = params.set('limit', filtros.limit.toString());
    }

    return this.http.get<ApiResponse<TransferenciasData>>(this.apiUrl, { params });
  }

  getSucursales(): Observable<ApiResponse<Sucursal[]>> {
    return this.http.get<ApiResponse<Sucursal[]>>(this.sucursalesUrl);
  }

  getOpcionesSucursal(id: number): Observable<ApiResponse<OpcionMenu[]>> {
    return this.http.get<ApiResponse<OpcionMenu[]>>(`${this.sucursalesUrl}/${id}/opciones`);
  }

  getBancos(): Observable<ApiResponse<Banco[]>> {
    return this.http.get<ApiResponse<Banco[]>>(this.bancosUrl);
  }

  crear(transferencia: Transferencia): Observable<ApiResponse<Transferencia>> {
    return this.http.post<ApiResponse<Transferencia>>(this.apiUrl, transferencia);
  }

  actualizar(id: number, transferencia: Transferencia): Observable<ApiResponse<Transferencia>> {
    return this.http.put<ApiResponse<Transferencia>>(`${this.apiUrl}/${id}`, transferencia);
  }

  eliminar(id: number): Observable<ApiResponse<{id: number}>> {
    return this.http.delete<ApiResponse<{id: number}>>(`${this.apiUrl}/${id}`);
  }
}
