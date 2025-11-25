# PhantomX Front

## Arquitectura del Proyecto

Arquitectura modular basada en tres capas principales:

```text
src/app/
├── core/              # Servicios singleton, guards e interceptors
├── features/          # Módulos lazy-loaded por funcionalidad
├── shared/            # Componentes y utilidades reutilizables
└── app.module.ts      # Módulo raíz
```

## Componentes Principales

### 1. Core Module

Módulo singleton con funcionalidad central de la aplicación.

**Guards:**

- `AuthGuard`: Protege rutas privadas verificando autenticación mediante JWT

**Interceptors:**

- `AuthInterceptor`: Adjunta automáticamente el token JWT a todas las peticiones HTTP
- `LoadingInterceptor`: Gestiona el spinner de carga global usando operadores RxJS
- `HttpErrorInterceptor`: Centraliza el manejo de errores HTTP y muestra notificaciones

**Services:**

- `AuthService`: Gestiona autenticación, almacena token en localStorage y emite estado mediante BehaviorSubject
- `TransferenciasService`: CRUD de transferencias con paginación, filtros y gestión de catálogos (sucursales/bancos)
- `NotificacionService`: Sistema de notificaciones toast (success, error, warning, info)
- `LoadingService`: Control del spinner mediante Observable pattern
- `ThemeService`: Alternado de tema claro/oscuro con persistencia en localStorage

### 2. Features Module

**Auth Module:**

- `LoginComponent`: Formulario reactivo con validaciones, autenticación JWT y redirección post-login

**Sucursales Module:**

- `LayoutSucursalComponent`: Layout principal con navbar (usuario, selector de sucursal, tema, logout)
- `SucursalesSelectorComponent`: Dropdown con Select2 para cambio de sucursal activa
- `AprobacionTransferenciasComponent`: Componente principal con:
  - Sistema de filtros (sucursal, banco, fechas, estado) con debounce
  - Paginación server-side con controles de tamaño
  - Tabla con formato de moneda y fechas
  - Modales para crear/editar transferencias
  - Flujo de aprobación/rechazo con observaciones
  - Operaciones CRUD completas

### 3. Shared Module

**Componentes:**

- `AppHeaderComponent`: Header reutilizable de la aplicación con navegación y controles de usuario
- `LoadingSpinnerComponent`: Spinner global suscrito a LoadingService con async pipe
- `ThemeToggleComponent`: Botón de alternado de tema con icono dinámico

**Estilos:**

- Variables SCSS: Colores, tipografía, espaciados y breakpoints
- Mixins: Funciones reutilizables para responsive design y componentes
- Componentes: Buttons, cards, forms, tables, badges, modals, pagination, statistics

## API Endpoints

**Autenticación:**

- `POST /api/login` - Login con username/password, retorna token JWT

**Transferencias:**

- `GET /api/transfers` - Lista con filtros y paginación (query params: sucursalId, bancoId, estado, fechaDesde, fechaHasta, usuario, sucursal, servicioFacturado, page, limit)
- `POST /api/transfers` - Crear transferencia
- `PUT /api/transfers/:id` - Actualizar transferencia
- `DELETE /api/transfers/:id` - Eliminar transferencia

**Catálogos:**

- `GET /api/sucursales` - Lista de sucursales
- `GET /api/sucursales/:id/opciones` - Opciones de menú para una sucursal específica
- `GET /api/bancos` - Lista de bancos
