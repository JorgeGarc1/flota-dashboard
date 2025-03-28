
// Datos de muestra para la visualización financiera
export const gastosPorCategoria = [
  { name: "Combustible", value: 45000, color: "#FF9900" },
  { name: "Mantenimiento", value: 28000, color: "#6F797F" },
  { name: "Salarios", value: 35000, color: "#DB0000" },
  { name: "Seguros", value: 15000, color: "#444444" },
  { name: "Otros", value: 7000, color: "#222222" },
  { name: "No Deducibles", value: 18000, color: "#666666" },
];

export const ingresosVsGastosMensuales = [
  { mes: "Ene", ingresos: 120000, gastos: 95000 },
  { mes: "Feb", ingresos: 135000, gastos: 105000 },
  { mes: "Mar", ingresos: 128000, gastos: 100000 },
  { mes: "Abr", ingresos: 142000, gastos: 110000 },
  { mes: "May", ingresos: 139000, gastos: 108000 },
  { mes: "Jun", ingresos: 150000, gastos: 113000 },
];

// Datos por semana para la visualización financiera
export const ingresosVsGastosSemanales = [
  { semana: "Sem 1", ingresos: 32000, gastos: 26000 },
  { semana: "Sem 2", ingresos: 35000, gastos: 28000 },
  { semana: "Sem 3", ingresos: 38000, gastos: 29000 },
  { semana: "Sem 4", ingresos: 36000, gastos: 27000 },
  { semana: "Sem 5", ingresos: 40000, gastos: 30000 },
  { semana: "Sem 6", ingresos: 37000, gastos: 28000 },
  { semana: "Sem 7", ingresos: 42000, gastos: 32000 },
  { semana: "Sem 8", ingresos: 39000, gastos: 29000 },
];

export const saldosTiempo = [
  { fecha: "Ene", saldo: 25000 },
  { fecha: "Feb", saldo: 55000 },
  { fecha: "Mar", saldo: 83000 },
  { fecha: "Abr", saldo: 115000 },
  { fecha: "May", saldo: 146000 },
  { fecha: "Jun", saldo: 183000 },
];

// Datos históricos semanales para la visualización de saldos
export const saldosHistoricos = [
  { fecha: "Sem 1", saldo: 6000 },
  { fecha: "Sem 2", saldo: 13000 },
  { fecha: "Sem 3", saldo: 22000 },
  { fecha: "Sem 4", saldo: 30000 },
  { fecha: "Sem 5", saldo: 41000 },
  { fecha: "Sem 6", saldo: 50000 },
  { fecha: "Sem 7", saldo: 62000 },
  { fecha: "Sem 8", saldo: 75000 },
];

export const cuentasResumen = [
  { cuenta: "Cuenta Operativa", ingresos: 750000, gastos: 580000, saldo: 170000 },
  { cuenta: "Cuenta Reservas", ingresos: 120000, gastos: 45000, saldo: 75000 },
  { cuenta: "Cuenta Inversiones", ingresos: 50000, gastos: 10000, saldo: 40000 },
];

// Nuevos datos de cuentas específicas con presupuestos
export const cuentasEspecificas = [
  { nombre: "Cuenta de Mantenimiento", saldo: 45000, presupuesto: 60000 },
  { nombre: "Cuenta de Combustible", saldo: 78000, presupuesto: 100000 },
  { nombre: "Cuenta de Casetas", saldo: 32000, presupuesto: 50000 },
];

// Datos de muestra para la visualización operativa
export const viajesPorCliente = [
  { name: "Cliente A", value: 120, color: "#FF9900" },
  { name: "Cliente B", value: 80, color: "#6F797F" },
  { name: "Cliente C", value: 60, color: "#DB0000" },
  { name: "Cliente D", value: 40, color: "#444444" },
];

export const viajesPorCamion = [
  { name: "Camión 001", value: 45, color: "#FF9900" },
  { name: "Camión 002", value: 38, color: "#6F797F" },
  { name: "Camión 003", value: 42, color: "#DB0000" },
  { name: "Camión 004", value: 35, color: "#444444" },
  { name: "Camión 005", value: 40, color: "#222222" },
];

export const viajesDiarios = [
  { dia: "Lunes", viajes: 35 },
  { dia: "Martes", viajes: 42 },
  { dia: "Miércoles", viajes: 38 },
  { dia: "Jueves", viajes: 40 },
  { dia: "Viernes", viajes: 45 },
  { dia: "Sábado", viajes: 25 },
  { dia: "Domingo", viajes: 15 },
];

export const kpisOperativos = {
  asistencias: 28,
  kilometros: 45680,
  combustible: 8950,
  combustiblePresupuestado: 10000,
  pedidosEntregados: 340,
  pedidosProgramados: 380
};

// Nuevos datos para la tabla de vehículos
export const vehiculosData = [
  {
    numeroEco: "FL001",
    estatus: "Ruta",
    kilometrosAcumulados: 125680,
    operadorAsignado: "Carlos Gómez",
    nivelServicio: 95,
    rendimientoPromedio: 3.2,
    incidencias: 2,
    saldoCasetas: 1580,
    kmParaServicio: 4320,
    costoPorKm: 8.5,
    polizaSeguro: "Vigente",
    costoMantenimiento: 4.2
  },
  {
    numeroEco: "FL002",
    estatus: "Taller",
    kilometrosAcumulados: 98750,
    operadorAsignado: "Manuel López",
    nivelServicio: 78,
    rendimientoPromedio: 2.9,
    incidencias: 5,
    saldoCasetas: 980,
    kmParaServicio: 1250,
    costoPorKm: 9.2,
    polizaSeguro: "Vigente",
    costoMantenimiento: 5.1
  },
  {
    numeroEco: "FL003",
    estatus: "Disponible",
    kilometrosAcumulados: 112450,
    operadorAsignado: "Rafael Mora",
    nivelServicio: 92,
    rendimientoPromedio: 3.4,
    incidencias: 1,
    saldoCasetas: 2100,
    kmParaServicio: 5500,
    costoPorKm: 7.8,
    polizaSeguro: "Vigente",
    costoMantenimiento: 3.8
  },
  {
    numeroEco: "FL004",
    estatus: "Sin operador",
    kilometrosAcumulados: 85600,
    operadorAsignado: "---",
    nivelServicio: 0,
    rendimientoPromedio: 3.1,
    incidencias: 0,
    saldoCasetas: 950,
    kmParaServicio: 9800,
    costoPorKm: 8.9,
    polizaSeguro: "Vigente",
    costoMantenimiento: 4.5
  },
  {
    numeroEco: "FL005",
    estatus: "Retorno",
    kilometrosAcumulados: 156700,
    operadorAsignado: "Luis Ramírez",
    nivelServicio: 88,
    rendimientoPromedio: 2.8,
    incidencias: 3,
    saldoCasetas: 1450,
    kmParaServicio: 3200,
    costoPorKm: 9.5,
    polizaSeguro: "Vencida",
    costoMantenimiento: 5.8
  },
  {
    numeroEco: "FL006",
    estatus: "CEDIS",
    kilometrosAcumulados: 132800,
    operadorAsignado: "Miguel Ángel Fuentes",
    nivelServicio: 90,
    rendimientoPromedio: 3.0,
    incidencias: 2,
    saldoCasetas: 1800,
    kmParaServicio: 7500,
    costoPorKm: 8.2,
    polizaSeguro: "Vigente",
    costoMantenimiento: 4.0
  },
  {
    numeroEco: "FL007",
    estatus: "En rampa",
    kilometrosAcumulados: 108950,
    operadorAsignado: "Juan Carlos Vega",
    nivelServicio: 85,
    rendimientoPromedio: 3.3,
    incidencias: 4,
    saldoCasetas: 1250,
    kmParaServicio: 6300,
    costoPorKm: 8.7,
    polizaSeguro: "Vigente",
    costoMantenimiento: 4.3
  },
];

// Datos de muestra para destinos
export const destinosData = [
  { destino: "Cliente A", tiempoDescarga: "01:45", numEntregas: 12 },
  { destino: "Cliente B", tiempoDescarga: "02:30", numEntregas: 8 },
  { destino: "Cliente C", tiempoDescarga: "01:15", numEntregas: 15 },
  { destino: "Cliente D", tiempoDescarga: "03:00", numEntregas: 6 },
  { destino: "Cliente E", tiempoDescarga: "00:45", numEntregas: 20 },
];

// Datos de muestra para acciones ejecutivas
export const accionesEjecutivas = [
  {
    id: 1,
    tipo: "preventiva",
    descripcion: "Revisión general de la flota",
    categoria: "Mantenimiento",
    usuarioAsignado: "Carlos González",
    fechaAsignacion: "2023-05-10",
    resultadoEsperado: "Reducción de incidencias",
    fechaEvaluacion: "2023-05-17",
    estado: "completada",
    notas: "Realizado conforme al plan",
  },
  {
    id: 2,
    tipo: "correctiva",
    descripcion: "Reparación urgente de unidad 003",
    categoria: "Reparación",
    usuarioAsignado: "Miguel Ángel López",
    fechaAsignacion: "2023-05-12",
    resultadoEsperado: "Unidad operativa",
    fechaEvaluacion: "2023-05-14",
    estado: "pendiente",
    notas: "En espera de piezas",
  },
  {
    id: 3,
    tipo: "preventiva",
    descripcion: "Capacitación de operadores",
    categoria: "Formación",
    usuarioAsignado: "Laura Ramírez",
    fechaAsignacion: "2023-05-05",
    resultadoEsperado: "Mejora en eficiencia",
    fechaEvaluacion: "2023-05-20",
    estado: "en progreso",
    notas: "Primera sesión completada",
  },
];

// Datos de muestra para el calendario de acciones
export const eventosCalendario = [
  {
    id: 1,
    title: "Evaluación de capacitación",
    date: "2023-05-20",
    accionId: 3,
    estado: "pendiente",
  },
  {
    id: 2,
    title: "Verificar reparación unidad 003",
    date: "2023-05-14",
    accionId: 2,
    estado: "vencido",
  },
  {
    id: 3,
    title: "Seguimiento de incidencias",
    date: "2023-05-17",
    accionId: 1,
    estado: "completado",
  },
  {
    id: 4,
    title: "Evaluación de nuevas rutas",
    date: "2023-05-25",
    accionId: 4,
    estado: "proximo",
  },
];

// Datos para el formulario de acciones ejecutivas
export const tiposDeAccion = ["preventiva", "correctiva"];

export const categoriasComunes = [
  "Mantenimiento",
  "Reparación",
  "Formación",
  "Optimización de rutas",
  "Seguridad",
  "Combustible",
  "Administrativo",
  "Otro",
];

export const resultadosEsperadosComunes = [
  "Reducción de costos",
  "Mejora de eficiencia",
  "Reducción de incidencias",
  "Unidad operativa",
  "Personal capacitado",
  "Mejora de servicio",
  "Optimización de recursos",
  "Cumplimiento normativo",
  "Otro",
];

export const usuariosOrganizacion = [
  "Carlos González",
  "Miguel Ángel López",
  "Laura Ramírez",
  "Javier Martínez",
  "Sofía García",
  "Rodrigo Sánchez",
  "Ana María Jiménez",
];
