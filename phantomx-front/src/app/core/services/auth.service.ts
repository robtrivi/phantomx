import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  token: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'phantomx_token';
  private readonly USER_KEY = 'phantomx_user';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<ApiResponse<LoginData>> {
    return this.http.post<ApiResponse<LoginData>>(`${environment.apiBaseUrl}/api/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data && response.data.token) {
            localStorage.setItem(this.TOKEN_KEY, response.data.token);
            localStorage.setItem(this.USER_KEY, response.data.nombre);
            this.loggedInSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
