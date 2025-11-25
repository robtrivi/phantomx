import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TransferenciasService,
  Transferencia,
  FiltrosTransferencias,
  Sucursal,
  Banco,
} from '../../../core/services/transferencias.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

declare const $: any;

@Component({
  selector: 'app-aprobacion-transferencias',
  templateUrl: './aprobacion-transferencias.component.html',
  styleUrls: ['./aprobacion-transferencias.component.scss'],
})
export class AprobacionTransferenciasComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('sucursalSelect') sucursalSelect: ElementRef | undefined;
  @ViewChild('bancoSelect') bancoSelect: ElementRef | undefined;

  filtrosForm: FormGroup;
  transferenciaForm: FormGroup;
  transferencias: Transferencia[] = [];
  transferenciasFiltradas: Transferencia[] = [];
  modoEdicion = false;
  transferenciaSeleccionada: Transferencia | null = null;
  transferenciaAEliminar: Transferencia | null = null;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalRecords = 0;
  Math = Math;

  sucursales: Sucursal[] = [];
  bancos: Banco[] = [];

  moment = moment;

  esLocale = Spanish;

  constructor(
    private fb: FormBuilder,
    private transferenciasService: TransferenciasService,
    private notificacionService: NotificacionService
  ) {
    this.filtrosForm = this.fb.group({
      sucursalId: [''],
      bancoId: [''],
      fechaDesde: [''],
      fechaHasta: [''],
      estado: [''],
    });

    this.transferenciaForm = this.fb.group({
      numeroPapeleta: ['', Validators.required],
      sucursalId: ['', Validators.required],
      bancoId: ['', Validators.required],
      cuentaBancaria: ['', Validators.required],
      fechaDeposito: ['', Validators.required],
      valorTotalEfectivo: ['', [Validators.required, Validators.min(0)]],
      usuario: [''],
      observacion: [''],
      servicioFacturado: [''],
      estado: ['PENDIENTE', Validators.required],
    });
  }

  ngOnInit(): void {
    moment.locale('es');

    this.cargarSucursales();
    this.cargarBancos();
    this.buscar();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inicializarSelect2Filtros();
      this.inicializarSelect2Modal();
    }, 100);
  }

  inicializarSelect2Filtros(): void {
    $('#sucursalSelectFiltro').select2({
      theme: 'bootstrap4',
      width: '100%',
      placeholder: 'Todas las sucursales',
      allowClear: true,
    });

    $('#sucursalSelectFiltro').on('change', (e: any) => {
      const value = $(e.target).val();
      this.filtrosForm.patchValue({ sucursalId: value ? Number(value) : null });
    });

    $('#bancoSelectFiltro').select2({
      theme: 'bootstrap4',
      width: '100%',
      placeholder: 'Todos los bancos',
      allowClear: true,
    });

    $('#bancoSelectFiltro').on('change', (e: any) => {
      const value = $(e.target).val();
      this.filtrosForm.patchValue({ bancoId: value ? Number(value) : null });
    });

    $('#estadoSelectFiltro').select2({
      theme: 'bootstrap4',
      width: '100%',
      placeholder: 'Todos',
      allowClear: true,
      minimumResultsForSearch: Infinity,
    });

    $('#estadoSelectFiltro').on('change', (e: any) => {
      const value = $(e.target).val();
      this.filtrosForm.patchValue({ estado: value || null });
    });
  }

  inicializarSelect2Modal(): void {
    $('#sucursalSelectModal').select2({
      theme: 'bootstrap4',
      width: '100%',
      dropdownParent: $('#transferenciaModal'),
    });

    $('#sucursalSelectModal').on('change', (e: any) => {
      const value = $(e.target).val();
      this.transferenciaForm.patchValue({
        sucursalId: value ? Number(value) : null,
      });
    });

    $('#bancoSelectModal').select2({
      theme: 'bootstrap4',
      width: '100%',
      dropdownParent: $('#transferenciaModal'),
    });

    $('#bancoSelectModal').on('change', (e: any) => {
      const value = $(e.target).val();
      this.transferenciaForm.patchValue({
        bancoId: value ? Number(value) : null,
      });
    });

    $('#estadoSelectModal').select2({
      theme: 'bootstrap4',
      width: '100%',
      dropdownParent: $('#transferenciaModal'),
      minimumResultsForSearch: Infinity,
    });

    $('#estadoSelectModal').on('change', (e: any) => {
      const value = $(e.target).val();
      this.transferenciaForm.patchValue({ estado: value || null });
    });
  }

  cargarSucursales(): void {
    this.transferenciasService.getSucursales().subscribe(
      (response) => {
        if (response.success) {
          this.sucursales = _.orderBy(response.data, ['nombre'], ['asc']);
          setTimeout(() => {
            $('#sucursalSelectFiltro').empty().trigger('change');
            $('#sucursalSelectFiltro').append(
              new Option('Todas las sucursales', '', true, true)
            );
            this.sucursales.forEach((s) => {
              $('#sucursalSelectFiltro').append(
                new Option(s.nombre, s.id.toString())
              );
            });

            $('#sucursalSelectModal').empty().trigger('change');
            this.sucursales.forEach((s) => {
              $('#sucursalSelectModal').append(
                new Option(s.nombre, s.id.toString())
              );
            });
          }, 100);
        }
      },
      (error) => {
        this.notificacionService.error('Error al cargar sucursales');
      }
    );
  }

  cargarBancos(): void {
    this.transferenciasService.getBancos().subscribe(
      (response) => {
        if (response.success) {
          this.bancos = _.orderBy(response.data, ['nombre'], ['asc']);
          setTimeout(() => {
            $('#bancoSelectFiltro').empty().trigger('change');
            $('#bancoSelectFiltro').append(
              new Option('Todos los bancos', '', true, true)
            );
            this.bancos.forEach((b) => {
              $('#bancoSelectFiltro').append(
                new Option(b.nombre, b.id.toString())
              );
            });

            $('#bancoSelectModal').empty().trigger('change');
            this.bancos.forEach((b) => {
              $('#bancoSelectModal').append(
                new Option(b.nombre, b.id.toString())
              );
            });
          }, 100);
        }
      },
      (error) => {
        this.notificacionService.error('Error al cargar bancos');
      }
    );
  }

  buscar(): void {
    const filtros: FiltrosTransferencias = {
      sucursalId: this.filtrosForm.value.sucursalId || undefined,
      bancoId: this.filtrosForm.value.bancoId || undefined,
      fechaDesde: this.filtrosForm.value.fechaDesde || undefined,
      fechaHasta: this.filtrosForm.value.fechaHasta || undefined,
      estado: this.filtrosForm.value.estado || undefined,
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.transferenciasService.buscarTransferencias(filtros).subscribe(
      (response) => {
        if (response.success) {
          this.transferencias = _.orderBy(
            response.data.rows,
            ['fechaDeposito'],
            ['desc']
          );
          this.totalRecords = response.data.totalRows;
          this.totalPages = Math.ceil(response.data.totalRows / this.pageSize);
          this.aplicarFiltrosLocales();
        }
      },
      (error) => {
        this.notificacionService.error('Error al cargar las transferencias');
      }
    );
  }

  abrirModalIngresar(): void {
    this.modoEdicion = false;
    this.transferenciaSeleccionada = null;
    this.transferenciaForm.reset({
      estado: 'PENDIENTE',
    });

    $('#sucursalSelectModal').val(null).trigger('change');
    $('#bancoSelectModal').val(null).trigger('change');

    $('#transferenciaModal').modal('show');
  }

  abrirModalEditar(transferencia: Transferencia): void {
    this.modoEdicion = true;
    this.transferenciaSeleccionada = transferencia;

    this.transferenciaForm.patchValue({
      numeroPapeleta: transferencia.numeroPapeleta,
      sucursalId: transferencia.sucursalId,
      bancoId: transferencia.bancoId,
      cuentaBancaria: transferencia.cuentaBancaria,
      fechaDeposito: transferencia.fechaDeposito,
      valorTotalEfectivo: transferencia.valorTotalEfectivo,
      usuario: transferencia.usuario || '',
      observacion: transferencia.observacion || '',
      servicioFacturado: transferencia.servicioFacturado || '',
      estado: transferencia.estado,
    });

    $('#sucursalSelectModal').val(transferencia.sucursalId).trigger('change');
    $('#bancoSelectModal').val(transferencia.bancoId).trigger('change');

    $('#transferenciaModal').modal('show');
  }

  guardarTransferencia(): void {
    if (this.transferenciaForm.valid) {
      const fechaDeposito = moment(this.transferenciaForm.value.fechaDeposito);
      if (!fechaDeposito.isValid()) {
        this.notificacionService.error('La fecha de depósito no es válida');
        return;
      }

      if (fechaDeposito.isAfter(moment())) {
        this.notificacionService.error(
          'La fecha de depósito no puede ser futura'
        );
        return;
      }

      const sucursal = _.find(this.sucursales, {
        id: this.transferenciaForm.value.sucursalId,
      });
      const banco = _.find(this.bancos, {
        id: this.transferenciaForm.value.bancoId,
      });

      const transferencia: Transferencia = {
        numeroPapeleta: this.transferenciaForm.value.numeroPapeleta,
        sucursalId: this.transferenciaForm.value.sucursalId,
        sucursal: sucursal?.nombre || '',
        bancoId: this.transferenciaForm.value.bancoId,
        bancoEmisor: banco?.nombre || '',
        cuentaBancaria: this.transferenciaForm.value.cuentaBancaria,
        fechaDeposito: fechaDeposito.format('YYYY-MM-DD'),
        valorTotalEfectivo: Number(
          this.transferenciaForm.value.valorTotalEfectivo
        ),
        usuario: this.transferenciaForm.value.usuario || '',
        observacion: this.transferenciaForm.value.observacion || '',
        servicioFacturado: this.transferenciaForm.value.servicioFacturado || '',
        estado: this.transferenciaForm.value.estado,
      };

      if (this.modoEdicion && this.transferenciaSeleccionada?.id) {
        this.transferenciasService
          .actualizar(this.transferenciaSeleccionada.id, transferencia)
          .subscribe(
            (response) => {
              if (response.success) {
                this.notificacionService.success(
                  'Transferencia actualizada correctamente'
                );
                $('#transferenciaModal').modal('hide');
                this.buscar();
              }
            },
            (error) => {
              this.notificacionService.error(
                'Error al actualizar la transferencia'
              );
            }
          );
      } else {
        this.transferenciasService.crear(transferencia).subscribe(
          (response) => {
            if (response.success) {
              this.notificacionService.success(
                'Transferencia creada correctamente'
              );
              $('#transferenciaModal').modal('hide');
              this.buscar();
            }
          },
          (error) => {
            this.notificacionService.error('Error al crear la transferencia');
          }
        );
      }
    } else {
      this.notificacionService.error(
        'Por favor complete todos los campos obligatorios'
      );
    }
  }

  confirmarEliminar(transferencia: Transferencia): void {
    this.transferenciaAEliminar = transferencia;
    $('#eliminarModal').modal('show');
  }

  eliminarTransferencia(): void {
    if (this.transferenciaAEliminar && this.transferenciaAEliminar.id) {
      this.transferenciasService
        .eliminar(this.transferenciaAEliminar.id)
        .subscribe(
          (response) => {
            if (response.success) {
              this.notificacionService.success(
                'Transferencia eliminada correctamente'
              );
              $('#eliminarModal').modal('hide');
              this.transferenciaAEliminar = null;
              this.buscar();
            }
          },
          (error) => {
            this.notificacionService.error(
              'Error al eliminar la transferencia'
            );
          }
        );
    }
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.buscar();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.buscar();
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset({
      sucursalId: '',
      bancoId: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
    });

    $('#sucursalSelectFiltro').val('').trigger('change');
    $('#bancoSelectFiltro').val('').trigger('change');
    $('#estadoSelectFiltro').val('').trigger('change');

    this.currentPage = 1;
    this.buscar();
  }

  obtenerClaseEstado(estado: string): string {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case 'PENDIENTE':
        return 'badge-warning';
      case 'APROBADA':
      case 'APROBADO':
        return 'badge-success';
      case 'RECHAZADA':
      case 'RECHAZADO':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  descargar(): void {
    this.notificacionService.info(
      'Función de descarga no implementada',
      'Información'
    );
  }

  aplicarFiltrosLocales(): void {
    let resultado = [...this.transferencias];

    if (this.filtrosForm.value.sucursalId) {
      resultado = _.filter(resultado, {
        sucursalId: this.filtrosForm.value.sucursalId,
      });
    }

    if (this.filtrosForm.value.bancoId) {
      resultado = _.filter(resultado, {
        bancoId: this.filtrosForm.value.bancoId,
      });
    }

    if (this.filtrosForm.value.estado) {
      resultado = _.filter(resultado, {
        estado: this.filtrosForm.value.estado,
      });
    }

    if (this.filtrosForm.value.fechaDesde) {
      const fechaDesde = moment(this.filtrosForm.value.fechaDesde);
      resultado = _.filter(resultado, (t) =>
        moment(t.fechaDeposito).isSameOrAfter(fechaDesde, 'day')
      );
    }

    if (this.filtrosForm.value.fechaHasta) {
      const fechaHasta = moment(this.filtrosForm.value.fechaHasta);
      resultado = _.filter(resultado, (t) =>
        moment(t.fechaDeposito).isSameOrBefore(fechaHasta, 'day')
      );
    }

    this.transferenciasFiltradas = resultado;
  }

  formatearFecha(fecha: string, formato: string = 'DD/MM/YYYY'): string {
    return moment(fecha).format(formato);
  }

  diasDesdeDeposito(fecha: string): number {
    return moment().diff(moment(fecha), 'days');
  }

  obtenerEstadisticas(): any {
    return {
      total: this.transferencias.length,
      pendientes: _.filter(this.transferencias, { estado: 'PENDIENTE' }).length,
      aprobadas: _.filter(this.transferencias, { estado: 'APROBADA' }).length,
      rechazadas: _.filter(this.transferencias, { estado: 'RECHAZADA' }).length,
      montoTotal: _.sumBy(this.transferencias, 'valorTotalEfectivo'),
      montoPromedio: _.meanBy(this.transferencias, 'valorTotalEfectivo'),
      montoMaximo:
        _.maxBy(this.transferencias, 'valorTotalEfectivo')
          ?.valorTotalEfectivo || 0,
      montoMinimo:
        _.minBy(this.transferencias, 'valorTotalEfectivo')
          ?.valorTotalEfectivo || 0,
    };
  }

  agruparPorSucursal(): any {
    return _.groupBy(this.transferencias, 'sucursal');
  }

  agruparPorEstado(): any {
    return _.groupBy(this.transferencias, 'estado');
  }
}
