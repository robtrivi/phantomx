import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalesSelectorComponent } from './sucursales-selector/sucursales-selector.component';
import { LayoutSucursalComponent } from './layout-sucursal/layout-sucursal.component';
import { AprobacionTransferenciasComponent } from './aprobacion-transferencias/aprobacion-transferencias.component';

const routes: Routes = [
  {
    path: '',
    component: SucursalesSelectorComponent
  },
  {
    path: ':id',
    component: LayoutSucursalComponent,
    children: [
      {
        path: 'aprobacion-transferencias',
        component: AprobacionTransferenciasComponent
      },
      {
        path: 'reportes',
        component: AprobacionTransferenciasComponent
      },
      {
        path: 'cierres',
        component: AprobacionTransferenciasComponent
      },
      {
        path: 'consultas',
        component: AprobacionTransferenciasComponent
      },
      {
        path: 'dashboard',
        component: AprobacionTransferenciasComponent
      },
      {
        path: 'operaciones',
        component: AprobacionTransferenciasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalesRoutingModule { }
