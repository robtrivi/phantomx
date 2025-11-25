import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransferenciasService, Sucursal } from '../../../core/services/transferencias.service';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-sucursales-selector',
  templateUrl: './sucursales-selector.component.html',
  styleUrls: ['./sucursales-selector.component.scss']
})
export class SucursalesSelectorComponent implements OnInit {
  sucursales: Sucursal[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private transferenciasService: TransferenciasService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarSucursales();
  }

  cargarSucursales(): void {
    this.cargando = true;
    this.transferenciasService.getSucursales().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.sucursales = response.data;
        } else {
          this.notificacionService.error('No se pudieron cargar las sucursales');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.notificacionService.error('Error al cargar las sucursales');
        console.error('Error cargando sucursales:', error);
        this.cargando = false;
      }
    });
  }

  seleccionarSucursal(sucursal: Sucursal): void {
    this.router.navigate(['/sucursales', sucursal.id]);
  }
}
