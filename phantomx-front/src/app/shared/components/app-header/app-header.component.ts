import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  @Input() nombreUsuario = '';
  @Input() mostrarMenuSucursales = true;
  @Output() onLogout = new EventEmitter<void>();

  logout(): void {
    this.onLogout.emit();
  }
}
