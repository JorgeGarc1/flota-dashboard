import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import LineChart from "@/components/charts/LineChart";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  viajesDiarios,
  kpisOperativos,
  vehiculosData
} from "@/data/mock-data";
import { AlertTriangle, Truck, Fuel, PackageCheck } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";

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

  // Configuración para el gráfico de líneas
  const lineChartLines = [
    { dataKey: "viajes", name: "Viajes", color: "#FF9900" },
  ];

  // Formateo para viajes (sin $ porque no son valores monetarios)
  const formatViajes = (value: number) => value.toString();

  // Calcular métricas de KPIs
  const totalCamiones = vehiculosData.length;
  const asistenciasEsperadas = totalCamiones * 7; // 7 asistencias semanales por camión
  const porcentajeAsistencias = Math.round((kpisOperativos.asistencias / asistenciasEsperadas) * 100);
  
  const metaKilometros = 2000 * totalCamiones; // 2000 km por camión
  const porcentajeKilometros = Math.min(100, Math.round((kpisOperativos.kilometros / metaKilometros) * 100));
  
  const porcentajeCombustible = Math.round((kpisOperativos.combustible / kpisOperativos.combustiblePresupuestado) * 100);
  
  const nivelServicio = Math.round((kpisOperativos.pedidosEntregados / kpisOperativos.pedidosProgramados) * 100);

  // Configuration for vehicle table columns with proper typing
  type VehiculoData = typeof vehiculosData[0];
  
  const vehiculosColumns = [
    { header: "Número Eco", accessor: "numeroEco" as keyof VehiculoData },
    { 
      header: "Estatus", 
      accessor: "estatus" as keyof VehiculoData, 
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
      accessor: "kilometrosAcumulados" as keyof VehiculoData, 
      cell: (value: number) => value.toLocaleString("es-MX") 
    },
    { header: "Operador", accessor: "operadorAsignado" as keyof VehiculoData },
    { 
      header: "Nivel Servicio", 
      accessor: "nivelServicio" as keyof VehiculoData, 
      cell: (value: number) => `${value}%` 
    },
    { 
      header: "Rendimiento (km/lt)", 
      accessor: "rendimientoPromedio" as keyof VehiculoData, 
      cell: (value: number) => value.toFixed(2) 
    },
    { header: "Incidencias", accessor: "incidencias" as keyof VehiculoData },
    { 
      header: "Saldo Casetas", 
      accessor: "saldoCasetas" as keyof VehiculoData, 
      cell: (value: number) => `$${value.toLocaleString("es-MX")}` 
    },
    { 
      header: "KM para Servicio", 
      accessor: "kmParaServicio" as keyof VehiculoData, 
      cell: (value: number) => value.toLocaleString("es-MX") 
    },
    { 
      header: "Costo por KM", 
      accessor: "costoPorKm" as keyof VehiculoData, 
      cell: (value: number) => `$${value.toFixed(2)}` 
    },
    { 
      header: "Costo Mantenimiento", 
      accessor: "costoMantenimiento" as keyof VehiculoData, 
      cell: (value: number) => `$${value.toFixed(2)}` 
    },
    { 
      header: "Póliza Seguro", 
      accessor: "polizaSeguro" as keyof VehiculoData, 
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

      {/* KPIs con barras de progreso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Asistencias"
          value={kpisOperativos.asistencias}
          reference={`Meta: ${asistenciasEsperadas} asistencias`}
          description={`${porcentajeAsistencias}% de asistencias efectivas`}
          icon={<AlertTriangle size={32} />}
          className="relative pb-8"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <Progress value={porcentajeAsistencias} className="h-2" />
          </div>
        </StatCard>
        
        <StatCard 
          title="Kilómetros Totales"
          value={kpisOperativos.kilometros.toLocaleString("es-MX")}
          reference={`Meta: ${metaKilometros.toLocaleString("es-MX")} km`}
          description={`${porcentajeKilometros}% de la meta semanal`}
          icon={<Truck size={32} />}
          className="relative pb-8"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <Progress value={porcentajeKilometros} className="h-2" />
          </div>
        </StatCard>
        
        <StatCard 
          title="Litros de Combustible"
          value={kpisOperativos.combustible.toLocaleString("es-MX")}
          reference={`Presupuesto: ${kpisOperativos.combustiblePresupuestado.toLocaleString("es-MX")} litros`}
          description={`${porcentajeCombustible}% del presupuesto utilizado`}
          icon={<Fuel size={32} />}
          className="relative pb-8"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <Progress value={porcentajeCombustible} className="h-2" />
          </div>
        </StatCard>
        
        <StatCard 
          title="Nivel de Servicio"
          value={`${nivelServicio}%`}
          reference={`${kpisOperativos.pedidosEntregados}/${kpisOperativos.pedidosProgramados} pedidos`}
          description="Pedidos entregados vs programados"
          icon={<PackageCheck size={32} />}
          className="relative pb-8"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <Progress value={nivelServicio} className="h-2" />
          </div>
        </StatCard>
      </div>

      {/* Tabla de vehículos */}
      <div className="card-dashboard mb-6">
        <h3 className="font-montserrat text-xl mb-4">Status de Flota</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-black/40 border-b border-flota-secondary/20">
                {vehiculosColumns.map((column) => (
                  <TableHead key={column.accessor} className="text-flota-text font-montserrat">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginateData(vehiculosData).map((vehiculo, index) => (
                <TableRow key={index} className="border-b border-flota-secondary/10 hover:bg-black/30">
                  {vehiculosColumns.map((column) => (
                    <TableCell key={column.accessor}>
                      {column.cell 
                        ? column.cell(vehiculo[column.accessor as keyof typeof vehiculo]) 
                        : vehiculo[column.accessor as keyof typeof vehiculo]}
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

      {/* Gráfico de líneas */}
      <div className="mb-6">
        <LineChart 
          data={viajesDiarios} 
          title="Viajes Diarios por Semana"
          lines={lineChartLines}
          xAxisDataKey="dia"
          formatValue={formatViajes}
        />
      </div>

      {/* Drill down modal */}
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
