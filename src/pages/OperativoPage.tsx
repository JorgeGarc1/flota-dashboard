import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import LineChart from "@/components/charts/LineChart";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  viajesDiarios,
  kpisOperativos,
  vehiculosData
} from "@/data/mock-data";
import { AlertTriangle, Truck, Fuel, PackageCheck, Activity } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function OperativoPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleShowData = (data: any[], title: string) => {
    setDialogData(data);
    setDialogTitle(title);
    setIsDialogOpen(true);
  };

  // Crear datos combinados para el gráfico dual
  const combinedChartData = viajesDiarios.map((item, index) => {
    // Calcular kilometraje acumulado semanal (simulado)
    // En un caso real, esto vendría de la base de datos
    const kilometrosAcumulados = Math.floor(Math.random() * 5000) + 15000;
    
    return {
      ...item,
      kilometrosAcumulados
    };
  });

  // Configuración para el gráfico de líneas dual
  const dualAxisLines = [
    { dataKey: "viajes", name: "Viajes Diarios", color: "#FF9900", yAxisId: "left" },
    { dataKey: "kilometrosAcumulados", name: "Kilómetros Acumulados", color: "#36A2EB", yAxisId: "right" }
  ];

  // Formateo para viajes (sin $ porque no son valores monetarios)
  const formatViajes = (value: number) => value.toString();
  
  // Formateo para kilómetros
  const formatKilometros = (value: number) => `${value.toLocaleString("es-MX")} km`;

  // Calcular métricas de indicadores operativos
  const totalUnidades = vehiculosData.length;
  const unidadesEnTaller = vehiculosData.filter(v => v.estatus === "Taller").length;
  const unidadesDisponibles = totalUnidades - unidadesEnTaller;
  const porcentajeDisponibilidad = Math.round((unidadesDisponibles / totalUnidades) * 100);
  
  // Simulación de datos para capacidad operativa
  const ordenesDeServicio = 12; // Simulado
  const capacidadTotal = unidadesDisponibles * 1.5; // Asumiendo que cada unidad puede manejar 1.5 órdenes
  const porcentajeOcupacion = Math.round((ordenesDeServicio / capacidadTotal) * 100);
  
  const metaKilometros = 2000 * totalUnidades; // 2000 km por camión
  const porcentajeKilometros = Math.min(100, Math.round((kpisOperativos.kilometros / metaKilometros) * 100));
  
  const porcentajeCombustible = Math.round((kpisOperativos.combustible / kpisOperativos.combustiblePresupuestado) * 100);
  
  const nivelServicio = Math.round((kpisOperativos.pedidosEntregados / kpisOperativos.pedidosProgramados) * 100);

  // Configuration for vehicle table columns with proper typing
  type VehiculoData = typeof vehiculosData[0];
  
  // Create a properly typed interface for our column structure
  interface TableColumn {
    header: string;
    accessor: keyof VehiculoData;
    cell?: (value: any, row?: VehiculoData) => React.ReactNode;
  }
  
  // Now define the columns with the proper typing
  const vehiculosColumns: TableColumn[] = [
    { header: "Número Eco", accessor: "numeroEco" },
    { 
      header: "Estatus", 
      accessor: "estatus", 
      cell: (value: string) => {
        const getStatusColor = (status: string) => {
          switch(status) {
            case "Taller": return "bg-yellow-600 text-white";
            case "Ruta": return "bg-green-600 text-white";
            case "Disponible": return "bg-blue-600 text-white";
            case "Retorno": return "bg-purple-600 text-white";
            case "En rampa": return "bg-orange-600 text-white";
            case "CEDIS": return "bg-indigo-600 text-white";
            case "Sin operador": return "bg-red-600 text-white";
            default: return "bg-gray-600 text-white";
          }
        };
        return (
          <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor(value))}>
            {value}
          </span>
        );
      }
    },
    { 
      header: "Kilómetros", 
      accessor: "kilometrosAcumulados", 
      cell: (value: number) => value.toLocaleString("es-MX") 
    },
    { header: "Operador", accessor: "operadorAsignado" },
    { 
      header: "Nivel Servicio", 
      accessor: "nivelServicio", 
      cell: (value: number) => `${value}%` 
    },
    { 
      header: "Rendimiento (km/lt)", 
      accessor: "rendimientoPromedio", 
      cell: (value: number) => value.toFixed(2) 
    },
    { header: "Incidencias", accessor: "incidencias" },
    { 
      header: "Saldo Casetas", 
      accessor: "saldoCasetas", 
      cell: (value: number) => `$${value.toLocaleString("es-MX")}` 
    },
    { 
      header: "KM para Servicio", 
      accessor: "kmParaServicio", 
      cell: (value: number) => value.toLocaleString("es-MX") 
    },
    { 
      header: "Costo por KM", 
      accessor: "costoPorKm", 
      cell: (value: number) => `$${value.toFixed(2)}` 
    },
    { 
      header: "Costo Mantenimiento", 
      accessor: "costoMantenimiento", 
      cell: (value: number) => `$${value.toFixed(2)}` 
    },
    { 
      header: "Póliza Seguro", 
      accessor: "polizaSeguro", 
      cell: (value: string) => {
        const isActive = value === "Vigente";
        return (
          <span className={cn("px-2 py-1 rounded text-xs font-medium", isActive ? "bg-green-600 text-white" : "bg-red-600 text-white")}>
            {value}
          </span>
        );
      }
    },
  ];

  // Paginación de datos
  const paginateData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(vehiculosData.length / itemsPerPage);

  return (
    <div>
      <PageHeader 
        title="Eficiencia Operativa" 
        subtitle="Métricas de operación de la flota"
      />

      {/* KPIs actualizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Disponibilidad"
          value={`${porcentajeDisponibilidad}%`}
          secondaryValue={unidadesDisponibles}
          secondaryLabel="Unidades activas"
          tertiaryValue={totalUnidades}
          tertiaryLabel="Total unidades"
          description={`${unidadesEnTaller} unidades en taller`}
          icon={<div className="flex justify-center"><AlertTriangle size={32} /></div>}
        />
        
        <StatCard 
          title="Capacidad Operativa"
          value={`${porcentajeOcupacion}%`}
          secondaryValue={ordenesDeServicio}
          secondaryLabel="Órdenes de servicio"
          tertiaryValue={Math.round(capacidadTotal)}
          tertiaryLabel="Capacidad máxima"
          description="Ocupación del parque vehicular disponible"
          icon={<div className="flex justify-center"><Activity size={32} /></div>}
        />
        
        <StatCard 
          title="Kilómetros Totales"
          value={kpisOperativos.kilometros.toLocaleString("es-MX")}
          reference={`Meta: ${metaKilometros.toLocaleString("es-MX")} km`}
          description={`${porcentajeKilometros}% de la meta semanal`}
          icon={<div className="flex justify-center"><Truck size={32} /></div>}
        />
        
        <StatCard 
          title="Nivel de Servicio"
          value={`${nivelServicio}%`}
          reference={`${kpisOperativos.pedidosEntregados}/${kpisOperativos.pedidosProgramados} pedidos`}
          description="Pedidos entregados vs programados"
          icon={<div className="flex justify-center"><PackageCheck size={32} /></div>}
        />
      </div>

      {/* Tabla de vehículos */}
      <div className="card-dashboard mb-6">
        <h3 className="font-montserrat text-xl mb-4">Status de Flota</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-black/40 border-b border-flota-secondary/20">
                {vehiculosColumns.map((column) => (
                  <TableHead key={column.accessor as string} className="text-flota-text font-montserrat">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginateData(vehiculosData).map((vehiculo, index) => (
                <TableRow key={index} className="border-b border-flota-secondary/10 hover:bg-black/30">
                  {vehiculosColumns.map((column) => (
                    <TableCell key={column.accessor as string}>
                      {column.cell 
                        ? column.cell(vehiculo[column.accessor], vehiculo) 
                        : vehiculo[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
            >
              Anterior
            </Button>
            <span className="text-sm text-flota-text">
              Página {currentPage} de {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* Gráfico de líneas con doble eje */}
      <div className="mb-6">
        <LineChart 
          data={combinedChartData} 
          title="Viajes Diarios y Kilómetros Acumulados por Semana"
          lines={dualAxisLines}
          xAxisDataKey="dia"
          formatValue={formatViajes}
          formatSecondaryValue={formatKilometros}
          showSecondaryAxis={true}
        />
      </div>

      {/* Modal de datos generales */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-flota-background border-flota-secondary/20 text-flota-text max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-flota-text bg-black/40 border-b border-flota-secondary/20">
                <tr>
                  {dialogData.length > 0 && Object.keys(dialogData[0]).map((key) => (
                    key !== "color" && (
                      <th key={key} className="px-4 py-3 font-montserrat">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {dialogData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="border-b border-flota-secondary/10 hover:bg-black/30"
                  >
                    {Object.entries(row).map(([key, value]) => (
                      key !== "color" && (
                        <td key={key} className="px-4 py-3">
                          {typeof value === 'number' 
                            ? value 
                            : value as React.ReactNode}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex space-x-4 mt-8">
        <Button 
          onClick={() => handleShowData(viajesDiarios, "Datos de Viajes Diarios")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Viajes Diarios
        </Button>
        <Button 
          onClick={() => handleShowData(vehiculosData, "Datos Detallados de Vehículos")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos Detallados de Vehículos
        </Button>
      </div>
    </div>
  );
}
