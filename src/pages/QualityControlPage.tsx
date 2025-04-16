
import React, { useState, useEffect } from 'react';
import PageHeader from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LineChart from "@/components/charts/LineChart";
import {
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Building,
  FilterIcon,
  ChevronDown,
  ChevronRight,
  Clock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { faker } from '@faker-js/faker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TemperatureGauge from "@/components/quality/TemperatureGauge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Time filter options
const timeFilterOptions = [
  { id: "today", name: "Hoy" },
  { id: "week", name: "Semana" },
  { id: "month", name: "Mes" },
];

// Define available CEDIS
const cedisList = [
  { id: "all", name: "Todos" },
  { id: "cedis1", name: "CEDIS Norte" },
  { id: "cedis2", name: "CEDIS Sur" },
  { id: "cedis3", name: "CEDIS Centro" },
  { id: "cedis4", name: "CEDIS Oeste" },
];

// Generate mock data
const generateMockData = (cedisFilter = "all", timeFilter = "today") => {
  // Adjust the data range based on the time filter
  const getDaysForTimeFilter = () => {
    switch (timeFilter) {
      case "today": return 1;
      case "week": return 7;
      case "month": return 30;
      default: return 1;
    }
  };
  
  const daysRange = getDaysForTimeFilter();
  
  // Vehicles data with incidents
  const vehicles = Array.from({ length: 15 + (daysRange > 1 ? daysRange : 0) }, (_, i) => {
    const vehicle = {
      id: `V-${1000 + i}`,
      numEco: `ECO-${1000 + i}`,
      type: faker.helpers.arrayElement(['Refrigerado', 'Congelado', 'Mixto']),
      status: faker.helpers.arrayElement(['Óptimo', 'Advertencia', 'Alerta']),
      incidentCount: faker.number.int({ min: 0, max: daysRange > 1 ? daysRange : 8 }),
      minTemp: faker.number.float({ min: 1.5, max: 5.0, fractionDigits: 1 }),
      maxTemp: faker.number.float({ min: 5.5, max: 10.5, fractionDigits: 1 }),
      avgTemp: faker.number.float({ min: 3.5, max: 7.0, fractionDigits: 1 }),
      cedis: faker.helpers.arrayElement(cedisList.filter(c => c.id !== "all")).id,
      incidents: []
    };
    
    // Generate incidents for vehicles (only if there are incidents)
    if (vehicle.incidentCount > 0) {
      // Generate incidents based on the time filter
      const incidentDaysBack = Math.min(daysRange, 14);
      
      vehicle.incidents = Array.from({ length: vehicle.incidentCount }, (_, j) => ({
        id: `INC-${i}-${j}`,
        date: faker.date.recent({ days: incidentDaysBack }).toLocaleDateString('es-MX'),
        time: faker.date.recent().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        temperature: faker.number.float({ min: 6.1, max: 10.5, fractionDigits: 1 }),
        location: faker.location.city(),
        client: faker.company.name(),
        details: faker.helpers.arrayElement([
          'Puerta abierta durante descarga',
          'Falla en sistema de refrigeración',
          'Demora prolongada en entrega',
          'Carga incorrecta de producto'
        ])
      }));
    }
    
    return vehicle;
  });

  // Filter vehicles by CEDIS if needed
  const filteredVehicles = cedisFilter !== "all" 
    ? vehicles.filter(v => v.cedis === cedisFilter) 
    : vehicles;

  // Temperature timeline data (for the last 4 weeks with daily data)
  const temperatureTimeline = Array.from({ length: 28 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - 27 + i);
    
    return {
      time: day.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' }),
      datetime: day.toISOString(),
      avgTemp: faker.number.float({ min: 2, max: 6.0, fractionDigits: 1 }),
      minTemp: faker.number.float({ min: 1.5, max: 3.5, fractionDigits: 1 }),
      maxTemp: faker.number.float({ min: 4.5, max: 6.5, fractionDigits: 1 }),
    };
  });

  // KPIs (adjusted based on time filter)
  const multiplier = timeFilter === "today" ? 1 : timeFilter === "week" ? 7 : 30;
  const kpis = {
    deliveriesBelow6C: faker.number.int({ min: 180, max: 220 }) * multiplier,
    deliveriesAbove6C: faker.number.int({ min: 10, max: 40 }) * multiplier,
    averageTemperature: faker.number.float({ min: 2.5, max: 5.8, fractionDigits: 1 }),
  };

  return {
    vehicles: filteredVehicles,
    temperatureTimeline,
    kpis
  };
};

export default function QualityControlPage() {
  const { theme } = useTheme();
  const [selectedCedis, setSelectedCedis] = useState("all");
  const [timeFilter, setTimeFilter] = useState("today");
  const [mockData, setMockData] = useState(generateMockData());
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6;

  // Handle CEDIS filter change
  const handleCedisChange = (value: string) => {
    setSelectedCedis(value);
    setMockData(generateMockData(value, timeFilter));
    setExpandedRows({});
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle time period filter change
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    setMockData(generateMockData(selectedCedis, value));
    setExpandedRows({});
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Toggle row expansion
  const toggleRowExpansion = (vehicleId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const { vehicles, temperatureTimeline, kpis } = mockData;

  // Pagination logic
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

  // Prepare data for charts
  const temperatureChartData = temperatureTimeline.map(data => ({
    time: data.time,
    avgTemp: data.avgTemp,
    minTemp: data.minTemp,
    maxTemp: data.maxTemp,
  }));

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink 
          isActive={currentPage === i} 
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Control de Calidad"
        subtitle="Monitoreo en tiempo real de la cadena de frío y control de flota"
        actions={
          <div className="flex space-x-2">
            <Select value={selectedCedis} onValueChange={handleCedisChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar CEDIS" />
              </SelectTrigger>
              <SelectContent>
                {cedisList.map(cedis => (
                  <SelectItem key={cedis.id} value={cedis.id}>
                    {cedis.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {timeFilterOptions.find(option => option.id === timeFilter)?.name || "Período"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timeFilterOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.id} 
                    onClick={() => handleTimeFilterChange(option.id)}
                    className={timeFilter === option.id ? "bg-accent" : ""}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        }
      />

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Vertical Indicators */}
        <div className="flex flex-col space-y-4">
          {/* KPI 1 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Entregas < 6°C"
                  value={kpis.deliveriesBelow6C}
                  icon={<CheckCircle className="h-6 w-6" />}
                  className="h-full"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Número de pedidos entregados a menos de 6°C</p>
            </TooltipContent>
          </Tooltip>

          {/* KPI 2 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Entregas > 6°C"
                  value={kpis.deliveriesAbove6C}
                  icon={<AlertTriangle className="h-6 w-6" />}
                  className="h-full"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Número de pedidos entregados a más de 6°C (fuera de rango)</p>
            </TooltipContent>
          </Tooltip>

          {/* Temperature Gauge */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Temperatura de entrega promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureGauge 
                value={kpis.averageTemperature} 
                min={0} 
                max={10} 
                optimal={{ min: 2, max: 6 }}
                compact 
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Incidents Table */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Incidencias por unidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Expandir</TableHead>
                      <TableHead>Num Eco</TableHead>
                      <TableHead>Incidencias</TableHead>
                      <TableHead>Temp. Min</TableHead>
                      <TableHead>Temp. Max</TableHead>
                      <TableHead>Temp. Promedio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentVehicles.map((vehicle) => (
                      <React.Fragment key={vehicle.id}>
                        <TableRow className={vehicle.incidentCount > 0 ? "cursor-pointer hover:bg-muted/70" : ""}>
                          <TableCell>
                            {vehicle.incidentCount > 0 ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleRowExpansion(vehicle.id)}
                              >
                                {expandedRows[vehicle.id] ? 
                                  <ChevronDown className="h-4 w-4" /> : 
                                  <ChevronRight className="h-4 w-4" />}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{vehicle.numEco}</TableCell>
                          <TableCell>{vehicle.incidentCount}</TableCell>
                          <TableCell>{vehicle.minTemp.toFixed(1)}°C</TableCell>
                          <TableCell>{vehicle.maxTemp.toFixed(1)}°C</TableCell>
                          <TableCell
                            className={
                              vehicle.avgTemp > 6 
                                ? "text-red-500 font-medium" 
                                : vehicle.avgTemp < 2 
                                ? "text-blue-500 font-medium" 
                                : "text-green-500 font-medium"
                            }
                          >
                            {vehicle.avgTemp.toFixed(1)}°C
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded incidents sub-table */}
                        {expandedRows[vehicle.id] && vehicle.incidents.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="p-0">
                              <div className="bg-muted/40 p-4 rounded-md my-2 mx-4">
                                <h4 className="text-sm font-medium mb-2">Detalles de incidencias (Temperatura {">"}  6°C)</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Fecha</TableHead>
                                      <TableHead>Hora</TableHead>
                                      <TableHead>Temperatura</TableHead>
                                      <TableHead>Cliente</TableHead>
                                      <TableHead>Detalles</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {vehicle.incidents.map(incident => (
                                      <TableRow key={incident.id}>
                                        <TableCell>{incident.date}</TableCell>
                                        <TableCell>{incident.time}</TableCell>
                                        <TableCell className="text-red-500 font-medium">
                                          {incident.temperature.toFixed(1)}°C
                                        </TableCell>
                                        <TableCell>{incident.client}</TableCell>
                                        <TableCell>{incident.details}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {paginationItems}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Histórico de temperatura promedio de entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={temperatureChartData}
                title=""
                xAxisDataKey="time"
                formatValue={(value) => `${value}°C`}
                lines={[
                  { dataKey: 'avgTemp', name: 'Promedio', color: '#36A2EB' },
                  { dataKey: 'minTemp', name: 'Mínima', color: '#4BC0C0' },
                  { dataKey: 'maxTemp', name: 'Máxima', color: '#FF6384' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
