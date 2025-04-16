
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import LineChart from "@/components/charts/LineChart";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { 
  viajesDiarios,
  kpisOperativos,
  vehiculosData
} from "@/data/mock-data";
import { AlertTriangle, Truck, Fuel, PackageCheck, Activity, Columns, Filter } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

export default function OperativoPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("day");
  const itemsPerPage = 5;

  // Estado para la visibilidad de las columnas
  const [visibleColumns, setVisibleColumns] = useState({
    numeroEco: true,
    estatus: true,
    kilometrosAcumulados: true,
    nivelServicio: true,
    rendimientoPromedio: true,
    incidencias: true,
    polizaSeguro: true
  });

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
    isVisible: boolean;
  }
  
  // Now define the columns with the proper typing
  const vehiculosColumns: TableColumn[] = [
    { header: "Número Eco", accessor: "numeroEco", isVisible: visibleColumns.numeroEco },
    { 
      header: "Estatus", 
      accessor: "estatus", 
      isVisible: visibleColumns.estatus,
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
      isVisible: visibleColumns.kilometrosAcumulados,
      cell: (value: number) => value.toLocaleString("es-MX") 
    },
    { 
      header: "Nivel Servicio", 
      accessor: "nivelServicio", 
      isVisible: visibleColumns.nivelServicio,
      cell: (value: number) => `${value}%` 
    },
    { 
      header: "Rendimiento (km/lt)", 
      accessor: "rendimientoPromedio", 
      isVisible: visibleColumns.rendimientoPromedio,
      cell: (value: number) => value.toFixed(2) 
    },
    { 
      header: "Incidencias", 
      accessor: "incidencias", 
      isVisible: visibleColumns.incidencias 
    },
    { 
      header: "Póliza Seguro", 
      accessor: "polizaSeguro", 
      isVisible: visibleColumns.polizaSeguro,
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

  // Filtrar columnas visibles
  const visibleVehiculosColumns = vehiculosColumns.filter(col => col.isVisible);

  // Manejar el cambio de visibilidad de columnas
  const toggleColumnVisibility = (accessor: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [accessor]: !prev[accessor],
    }));
  };

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

      {/* Filtro de rango de tiempo */}
      <div className="mb-6 flex justify-end">
        <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
          <ToggleGroupItem value="day" className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60 data-[state=on]:bg-black/70">
            Día
          </ToggleGroupItem>
          <ToggleGroupItem value="week" className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60 data-[state=on]:bg-black/70">
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem value="month" className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60 data-[state=on]:bg-black/70">
            Mes
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-montserrat text-xl">Status de Flota</h3>
          
          {/* Dropdown para seleccionar columnas visibles */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60">
                <Columns className="mr-2 h-4 w-4" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-flota-background border-flota-secondary/20 text-flota-text">
              <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleColumns.numeroEco}
                onCheckedChange={() => toggleColumnVisibility("numeroEco")}
              >
                Número Eco
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.estatus}
                onCheckedChange={() => toggleColumnVisibility("estatus")}
              >
                Estatus
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.kilometrosAcumulados}
                onCheckedChange={() => toggleColumnVisibility("kilometrosAcumulados")}
              >
                Kilómetros
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.nivelServicio}
                onCheckedChange={() => toggleColumnVisibility("nivelServicio")}
              >
                Nivel Servicio
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.rendimientoPromedio}
                onCheckedChange={() => toggleColumnVisibility("rendimientoPromedio")}
              >
                Rendimiento
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.incidencias}
                onCheckedChange={() => toggleColumnVisibility("incidencias")}
              >
                Incidencias
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.polizaSeguro}
                onCheckedChange={() => toggleColumnVisibility("polizaSeguro")}
              >
                Póliza Seguro
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-black/40 border-b border-flota-secondary/20">
                {visibleVehiculosColumns.map((column) => (
                  <TableHead key={column.accessor as string} className="text-flota-text font-montserrat">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginateData(vehiculosData).map((vehiculo, index) => (
                <TableRow key={index} className="border-b border-flota-secondary/10 hover:bg-black/30">
                  {visibleVehiculosColumns.map((column) => (
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
    </div>
  );
}
