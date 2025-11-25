import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SucursalesRoutingModule } from './sucursales-routing.module';
import { SucursalesSelectorComponent } from './sucursales-selector/sucursales-selector.component';
import { LayoutSucursalComponent } from './layout-sucursal/layout-sucursal.component';
import { AprobacionTransferenciasComponent } from './aprobacion-transferencias/aprobacion-transferencias.component';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  declarations: [
    SucursalesSelectorComponent,
    LayoutSucursalComponent,
    AprobacionTransferenciasComponent
  ],
  imports: [
    SharedModule,
    SucursalesRoutingModule,
    FlatpickrModule.forRoot()
  ]
})
export class SucursalesModule { }
