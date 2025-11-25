import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TransferenciasService, OpcionMenu } from '../../../core/services/transferencias.service';
import { NotificacionService } from '../../../core/services/notificacion.service';

interface MenuItem {
  nombre: string;
  subruta: string;
  habilitado: boolean;
  esActual: boolean;
}

@Component({
  selector: 'app-layout-sucursal',
  templateUrl: './layout-sucursal.component.html',
  styleUrls: ['./layout-sucursal.component.scss']
})
export class LayoutSucursalComponent implements OnInit {
  nombreSucursal = '';
  nombreUsuario = '';
  sucursalId: number = 0;

  menuItems: MenuItem[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private transferenciasService: TransferenciasService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = this.authService.getUsuario() || 'Usuario';

    this.route.params.subscribe(params => {
      this.sucursalId = +params['id'];
      this.cargarDatosSucursal();
    });
  }

  cargarDatosSucursal(): void {
    this.cargando = true;
    
    this.transferenciasService.getSucursales().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const sucursal = response.data.find(s => s.id === this.sucursalId);
          this.nombreSucursal = sucursal ? sucursal.nombre : `Sucursal ${this.sucursalId}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar sucursal:', error);
        this.nombreSucursal = `Sucursal ${this.sucursalId}`;
      }
    });

    this.transferenciasService.getOpcionesSucursal(this.sucursalId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.construirMenu(response.data);
          this.navegarPorDefecto();
        } else {
          this.notificacionService.error('No se pudieron cargar las opciones del menú');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.notificacionService.error('Error al cargar el menú de opciones');
        console.error('Error cargando opciones:', error);
        this.cargando = false;
      }
    });
  }

  construirMenu(opciones: OpcionMenu[]): void {
    this.menuItems = opciones.map(opcion => {
      let habilitado = false;
      
      if (this.sucursalId === 1) {
        habilitado = opcion.subruta === '/aprobacion-transferencias';
      }
      
      return {
        nombre: opcion.nombre,
        subruta: opcion.subruta,
        habilitado: habilitado,
        esActual: false
      };
    });
  }

  navegarPorDefecto(): void {
    if (this.sucursalId === 1) {
      const opcionAprobacion = this.menuItems.find(m => m.subruta === '/aprobacion-transferencias');
      if (opcionAprobacion) {
        opcionAprobacion.esActual = true;
        this.router.navigate(['/sucursales', this.sucursalId, 'aprobacion-transferencias']);
      }
    }
  }

  onMenuClick(item: MenuItem): void {
    if (!item.habilitado) {
      if (this.sucursalId === 1) {
        this.notificacionService.info(
          'Módulo en construcción. En este piloto solo está disponible la bandeja de aprobación de transferencias.',
          'Próximamente'
        );
      } else {
        this.notificacionService.info(
          'Por ahora solo está habilitada la aprobación de transferencias de la Sucursal Central.',
          'No disponible'
        );
      }
      return;
    }

    this.menuItems.forEach(m => m.esActual = false);
    item.esActual = true;
    this.router.navigate(['/sucursales', this.sucursalId, item.subruta.replace('/', '')]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
