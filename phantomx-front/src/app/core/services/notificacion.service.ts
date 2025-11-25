import { Injectable } from '@angular/core';

declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private toastCounter = 0;

  constructor() {}

  success(mensaje: string, titulo: string = 'Éxito'): void {
    this.mostrarToast(mensaje, titulo, 'success');
  }

  error(mensaje: string, titulo: string = 'Error'): void {
    this.mostrarToast(mensaje, titulo, 'danger');
  }

  warning(mensaje: string, titulo: string = 'Advertencia'): void {
    this.mostrarToast(mensaje, titulo, 'warning');
  }

  info(mensaje: string, titulo: string = 'Información'): void {
    this.mostrarToast(mensaje, titulo, 'info');
  }

  private mostrarToast(mensaje: string, titulo: string, tipo: string): void {
    const id = `toast-${this.toastCounter++}`;
    const toastHtml = `
      <div id="${id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" 
           style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
        <div class="toast-header bg-${tipo} text-white">
          <strong class="mr-auto">${titulo}</strong>
          <button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          ${mensaje}
        </div>
      </div>
    `;

    $('body').append(toastHtml);
    $(`#${id}`).toast({ autohide: true, delay: 3000 });
    $(`#${id}`).toast('show');
    
    $(`#${id}`).on('hidden.bs.toast', function() {
      $(this).remove();
    });
  }
}
