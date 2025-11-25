import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificacionService } from '../services/notificacion.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificacionService: NotificacionService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
            errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
          } else if (error.status === 403) {
            errorMessage = 'No tiene permisos para realizar esta acción.';
          } else if (error.status === 404) {
            errorMessage = 'Recurso no encontrado.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
        }

        return throwError(error);
      })
    );
  }
}
