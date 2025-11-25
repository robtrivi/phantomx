const express = require("express");
const cors = require("cors");
const { sendSuccess, sendSuccessRows, sendError } = require("./apiResponse");

const app = express();
app.use(cors());
app.use(express.json());

let bancos = [
  { id: 1, nombre: "Banco Nacional" },
  { id: 2, nombre: "Banco Provincial" },
  { id: 3, nombre: "Banco Universal" },
  { id: 4, nombre: "Banco del Comercio" },
  { id: 5, nombre: "Banco Internacional" },
];

let sucursales = [
  {
    id: 1,
    nombre: "Sucursal Central",
    opciones: [
      {
        id: 1,
        nombre: "Bandeja de aprobación de transferencias",
        subruta: "/aprobacion-transferencias",
      },
      {
        id: 2,
        nombre: "Aprobación de reembolsos a asegurados",
        subruta: "/aprobacion-reembolsos",
      },
      {
        id: 3,
        nombre: "Conciliación bancaria diaria",
        subruta: "/conciliacion-bancaria",
      },
    ],
  },
  {
    id: 2,
    nombre: "Sucursal Norte",
    opciones: [
      {
        id: 1,
        nombre: "Registro de cobranzas y recaudos",
        subruta: "/cobranzas-recaudos",
      },
      {
        id: 2,
        nombre: "Consulta de estado de pólizas",
        subruta: "/estado-polizas",
      },
    ],
  },
  {
    id: 3,
    nombre: "Sucursal Sur",
    opciones: [
      {
        id: 5,
        nombre: "Reportes de producción médica",
        subruta: "/reportes-produccion-medica",
      },
    ],
  },
  {
    id: 4,
    nombre: "Sucursal Este",
    opciones: [
      {
        id: 4,
        nombre: "Control de cajas y arqueos",
        subruta: "/control-cajas-arqueos",
      },
      {
        id: 5,
        nombre: "Reportes financieros de sucursal",
        subruta: "/reportes-financieros-sucursal",
      },
    ],
  },
];

let transfers = [
  {
    id: 1,
    numeroPapeleta: "PAP-2025-001",
    sucursalId: 1,
    sucursal: "Sucursal Central",
    bancoId: 1,
    bancoEmisor: "Banco Nacional",
    cuentaBancaria: "0123456789",
    fechaDeposito: "2025-11-20",
    valorTotalEfectivo: 1250.5,
    usuario: "Juan Pérez",
    observacion: "Pago de consulta médica",
    servicioFacturado: "Consulta",
    estado: "PENDIENTE",
    fechaHora: "2025-11-20T08:30:00",
  },
  {
    id: 2,
    numeroPapeleta: "PAP-2025-002",
    sucursalId: 2,
    sucursal: "Sucursal Norte",
    bancoId: 2,
    bancoEmisor: "Banco Provincial",
    cuentaBancaria: "9876543210",
    fechaDeposito: "2025-11-21",
    valorTotalEfectivo: 3500.0,
    usuario: "María González",
    observacion: "Análisis de laboratorio completo",
    servicioFacturado: "Laboratorio",
    estado: "APROBADA",
    fechaHora: "2025-11-21T10:15:00",
  },
  {
    id: 3,
    numeroPapeleta: "PAP-2025-003",
    sucursalId: 3,
    sucursal: "Sucursal Sur",
    bancoId: 3,
    bancoEmisor: "Banco Universal",
    cuentaBancaria: "5555666677",
    fechaDeposito: "2025-11-22",
    valorTotalEfectivo: 850.75,
    usuario: "Carlos Rodríguez",
    observacion: "Revisión de rutina",
    servicioFacturado: "Consulta",
    estado: "RECHAZADA",
    fechaHora: "2025-11-22T14:45:00",
  },
  {
    id: 4,
    numeroPapeleta: "PAP-2025-004",
    sucursalId: 1,
    sucursal: "Sucursal Central",
    bancoId: 1,
    bancoEmisor: "Banco Nacional",
    cuentaBancaria: "0123456789",
    fechaDeposito: "2025-11-23",
    valorTotalEfectivo: 2100.0,
    usuario: "Ana Martínez",
    observacion: "Estudios de imagen",
    servicioFacturado: "Imagenología",
    estado: "PENDIENTE",
    fechaHora: "2025-11-23T09:00:00",
  },
  {
    id: 5,
    numeroPapeleta: "PAP-2025-005",
    sucursalId: 4,
    sucursal: "Sucursal Este",
    bancoId: 4,
    bancoEmisor: "Banco del Comercio",
    cuentaBancaria: "4444555566",
    fechaDeposito: "2025-11-23",
    valorTotalEfectivo: 4500.25,
    usuario: "Pedro López",
    observacion: "Cirugía menor",
    servicioFacturado: "Cirugía",
    estado: "APROBADA",
    fechaHora: "2025-11-23T11:30:00",
  },
  {
    id: 6,
    numeroPapeleta: "PAP-2025-006",
    sucursalId: 2,
    sucursal: "Sucursal Norte",
    bancoId: 2,
    bancoEmisor: "Banco Provincial",
    cuentaBancaria: "9876543210",
    fechaDeposito: "2025-11-24",
    valorTotalEfectivo: 1800.0,
    usuario: "Laura Sánchez",
    observacion: "Examen de sangre",
    servicioFacturado: "Laboratorio",
    estado: "PENDIENTE",
    fechaHora: "2025-11-24T08:00:00",
  },
  {
    id: 7,
    numeroPapeleta: "PAP-2025-007",
    sucursalId: 3,
    sucursal: "Sucursal Sur",
    bancoId: 3,
    bancoEmisor: "Banco Universal",
    cuentaBancaria: "5555666677",
    fechaDeposito: "2025-11-24",
    valorTotalEfectivo: 950.5,
    usuario: "Roberto Díaz",
    observacion: "Consulta de especialista",
    servicioFacturado: "Consulta",
    estado: "APROBADA",
    fechaHora: "2025-11-24T13:20:00",
  },
  {
    id: 8,
    numeroPapeleta: "PAP-2025-008",
    sucursalId: 1,
    sucursal: "Sucursal Central",
    bancoId: 1,
    bancoEmisor: "Banco Nacional",
    cuentaBancaria: "0123456789",
    fechaDeposito: "2025-11-24",
    valorTotalEfectivo: 6200.0,
    usuario: "Carmen Torres",
    observacion: "Procedimiento quirúrgico",
    servicioFacturado: "Cirugía",
    estado: "PENDIENTE",
    fechaHora: "2025-11-24T15:45:00",
  },
  {
    id: 9,
    numeroPapeleta: "PAP-2025-009",
    sucursalId: 2,
    sucursal: "Sucursal Norte",
    bancoId: 5,
    bancoEmisor: "Banco Internacional",
    cuentaBancaria: "1111222233",
    fechaDeposito: "2025-11-24",
    valorTotalEfectivo: 1500.0,
    usuario: "Diego Fernández",
    observacion: "Consulta general",
    servicioFacturado: "Consulta",
    estado: "PENDIENTE",
    fechaHora: "2025-11-24T16:00:00",
  },
  {
    id: 10,
    numeroPapeleta: "PAP-2025-010",
    sucursalId: 4,
    sucursal: "Sucursal Este",
    bancoId: 4,
    bancoEmisor: "Banco del Comercio",
    cuentaBancaria: "4444555566",
    fechaDeposito: "2025-11-24",
    valorTotalEfectivo: 2750.0,
    usuario: "Sofía Ramírez",
    observacion: "Estudios especializados",
    servicioFacturado: "Laboratorio",
    estado: "APROBADA",
    fechaHora: "2025-11-24T17:30:00",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    return sendSuccess(res, 200, "Login exitoso", {
      token: "fake-token",
      nombre: "robtrivi",
    });
  }
  return sendError(res, 401, "Credenciales inválidas");
});

app.get("/api/sucursales", (req, res) => {
  const sucursalesSimplificadas = sucursales.map(({ id, nombre }) => ({
    id,
    nombre,
  }));
  sendSuccess(
    res,
    200,
    "Sucursales obtenidas exitosamente",
    sucursalesSimplificadas
  );
});

app.get("/api/bancos", (req, res) => {
  sendSuccess(res, 200, "Bancos obtenidos exitosamente", bancos);
});

app.get("/api/sucursales/:id/opciones", (req, res) => {
  try {
    const sucursalId = Number(req.params.id);
    const sucursal = sucursales.find((s) => s.id === sucursalId);

    if (!sucursal) {
      return sendError(res, 404, "Sucursal no encontrada");
    }

    sendSuccess(
      res,
      200,
      "Opciones de submenú obtenidas exitosamente",
      sucursal.opciones
    );
  } catch (error) {
    sendError(res, 500, "Error al obtener opciones de submenú", error.message);
  }
});

app.get("/api/transfers", (req, res) => {
  try {
    const {
      usuario,
      sucursal,
      sucursalId,
      bancoId,
      estado,
      servicioFacturado,
      fechaDesde,
      fechaHasta,
      page,
      limit,
    } = req.query;

    const parseDateParam = (value) => {
      if (!value) return null;
      if (value === "null" || value === "undefined") return null;

      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        return null;
      }
      return d;
    };

    const fechaDesdeDate = parseDateParam(fechaDesde);
    const fechaHastaDate = parseDateParam(fechaHasta);

    let filtradas = [...transfers];

    if (sucursalId) {
      filtradas = filtradas.filter((t) => t.sucursalId === Number(sucursalId));
    }

    if (bancoId) {
      filtradas = filtradas.filter((t) => t.bancoId === Number(bancoId));
    }

    if (estado && estado.trim() !== "") {
      filtradas = filtradas.filter(
        (t) => t.estado.toLowerCase() === estado.toLowerCase()
      );
    }

    if (fechaDesdeDate || fechaHastaDate) {
      filtradas = filtradas.filter((t) => {
        const depositoDate = new Date(t.fechaDeposito);

        if (Number.isNaN(depositoDate.getTime())) {
          return false;
        }

        if (fechaDesdeDate && depositoDate < fechaDesdeDate) {
          return false;
        }

        if (fechaHastaDate && depositoDate > fechaHastaDate) {
          return false;
        }

        return true;
      });
    }

    if (usuario && usuario.trim() !== "") {
      filtradas = filtradas.filter((t) =>
        t.usuario.toLowerCase().includes(usuario.toLowerCase())
      );
    }

    if (sucursal && sucursal.trim() !== "") {
      filtradas = filtradas.filter((t) =>
        t.sucursal.toLowerCase().includes(sucursal.toLowerCase())
      );
    }

    if (servicioFacturado && servicioFacturado.trim() !== "") {
      filtradas = filtradas.filter((t) =>
        t.servicioFacturado
          .toLowerCase()
          .includes(servicioFacturado.toLowerCase())
      );
    }

    // Paginación
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 5;
    const totalItems = filtradas.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filtradas.slice(startIndex, endIndex);

    sendSuccessRows(
      res,
      200,
      "Transferencias obtenidas exitosamente",
      paginatedItems,
      totalItems
    );
  } catch (error) {
    sendError(res, 500, "Error al obtener transferencias", error.message);
  }
});

app.post("/api/transfers", (req, res) => {
  try {
    const {
      numeroPapeleta,
      sucursalId,
      bancoId,
      cuentaBancaria,
      fechaDeposito,
      valorTotalEfectivo,
      usuario,
      observacion,
      servicioFacturado,
      estado,
    } = req.body;

    if (
      !numeroPapeleta ||
      !sucursalId ||
      !bancoId ||
      !cuentaBancaria ||
      !fechaDeposito ||
      !valorTotalEfectivo
    ) {
      return sendError(res, 400, "Faltan campos requeridos", [
        "numeroPapeleta, sucursalId, bancoId, cuentaBancaria, fechaDeposito y valorTotalEfectivo son obligatorios",
      ]);
    }

    const sucursal = sucursales.find((s) => s.id === Number(sucursalId));
    const banco = bancos.find((b) => b.id === Number(bancoId));

    if (!sucursal) {
      return sendError(res, 400, "Sucursal no encontrada");
    }

    if (!banco) {
      return sendError(res, 400, "Banco no encontrado");
    }

    const nuevo = {
      id: Date.now(),
      numeroPapeleta,
      sucursalId: Number(sucursalId),
      sucursal: sucursal.nombre,
      bancoId: Number(bancoId),
      bancoEmisor: banco.nombre,
      cuentaBancaria,
      fechaDeposito,
      valorTotalEfectivo: Number(valorTotalEfectivo),
      usuario: usuario || "",
      observacion: observacion || "",
      servicioFacturado: servicioFacturado || "",
      estado: estado || "PENDIENTE",
      fechaHora: new Date().toISOString(),
    };

    transfers.push(nuevo);
    sendSuccess(res, 201, "Transferencia creada exitosamente", nuevo);
  } catch (error) {
    sendError(res, 500, "Error al crear transferencia", error.message);
  }
});

app.put("/api/transfers/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = transfers.findIndex((t) => t.id === id);

    if (index === -1) {
      return sendError(res, 404, "Transferencia no encontrada");
    }

    const {
      numeroPapeleta,
      sucursalId,
      bancoId,
      cuentaBancaria,
      fechaDeposito,
      valorTotalEfectivo,
      usuario,
      observacion,
      servicioFacturado,
      estado,
    } = req.body;

    let sucursalNombre = transfers[index].sucursal;
    let bancoNombre = transfers[index].bancoEmisor;

    if (sucursalId && sucursalId !== transfers[index].sucursalId) {
      const sucursal = sucursales.find((s) => s.id === Number(sucursalId));
      if (!sucursal) {
        return sendError(res, 400, "Sucursal no encontrada");
      }
      sucursalNombre = sucursal.nombre;
    }

    if (bancoId && bancoId !== transfers[index].bancoId) {
      const banco = bancos.find((b) => b.id === Number(bancoId));
      if (!banco) {
        return sendError(res, 400, "Banco no encontrado");
      }
      bancoNombre = banco.nombre;
    }

    transfers[index] = {
      ...transfers[index],
      ...(numeroPapeleta && { numeroPapeleta }),
      ...(sucursalId && {
        sucursalId: Number(sucursalId),
        sucursal: sucursalNombre,
      }),
      ...(bancoId && { bancoId: Number(bancoId), bancoEmisor: bancoNombre }),
      ...(cuentaBancaria && { cuentaBancaria }),
      ...(fechaDeposito && { fechaDeposito }),
      ...(valorTotalEfectivo && {
        valorTotalEfectivo: Number(valorTotalEfectivo),
      }),
      ...(usuario !== undefined && { usuario }),
      ...(observacion !== undefined && { observacion }),
      ...(servicioFacturado !== undefined && { servicioFacturado }),
      ...(estado && { estado }),
    };

    sendSuccess(
      res,
      200,
      "Transferencia actualizada exitosamente",
      transfers[index]
    );
  } catch (error) {
    sendError(res, 500, "Error al actualizar transferencia", error.message);
  }
});

app.delete("/api/transfers/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = transfers.findIndex((t) => t.id === id);

    if (index === -1) {
      return sendError(res, 404, "Transferencia no encontrada");
    }

    transfers = transfers.filter((t) => t.id !== id);
    sendSuccess(res, 200, "Transferencia eliminada exitosamente", { id });
  } catch (error) {
    sendError(res, 500, "Error al eliminar transferencia", error.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend PhantomX escuchando en http://localhost:${PORT}`);
});
