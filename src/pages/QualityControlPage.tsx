
import React, { useState } from 'react';
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
  ChevronRight
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { faker } from '@faker-js/faker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TemperatureGauge from "@/components/quality/TemperatureGauge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define available CEDIS
const cedisList = [
  { id: "all", name: "Todos" },
  { id: "cedis1", name: "CEDIS Norte" },
  { id: "cedis2", name: "CEDIS Sur" },
  { id: "cedis3", name: "CEDIS Centro" },
  { id: "cedis4", name: "CEDIS Oeste" },
];

// Generate mock data
const generateMockData = (cedisFilter = "all") => {
  // Vehicles data with incidents
  const vehicles = Array.from({ length: 15 }, (_, i) => {
    const vehicle = {
      id: `V-${1000 + i}`,
      numEco: `ECO-${1000 + i}`,
      type: faker.helpers.arrayElement(['Refrigerado', 'Congelado', 'Mixto']),
      status: faker.helpers.arrayElement(['Óptimo', 'Advertencia', 'Alerta']),
      incidentCount: faker.number.int({ min: 0, max: 8 }),
      minTemp: faker.number.float({ min: 1.5, max: 5.0, fractionDigits: 1 }),
      maxTemp: faker.number.float({ min: 5.5, max: 10.5, fractionDigits: 1 }),
      avgTemp: faker.number.float({ min: 3.5, max: 7.0, fractionDigits: 1 }),
      cedis: faker.helpers.arrayElement(cedisList.filter(c => c.id !== "all")).id,
      incidents: []
    };
    
    // Generate incidents for vehicles (only if there are incidents)
    if (vehicle.incidentCount > 0) {
      vehicle.incidents = Array.from({ length: vehicle.incidentCount }, (_, j) => ({
        id: `INC-${i}-${j}`,
        date: faker.date.recent({ days: 14 }).toLocaleDateString('es-MX'),
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

  // KPIs
  const kpis = {
    deliveriesBelow6C: faker.number.int({ min: 180, max: 220 }),
    deliveriesAbove6C: faker.number.int({ min: 10, max: 40 }),
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
  const [mockData, setMockData] = useState(generateMockData());
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Handle CEDIS filter change
  const handleCedisChange = (value: string) => {
    setSelectedCedis(value);
    setMockData(generateMockData(value));
    setExpandedRows({});
  };

  // Toggle row expansion
  const toggleRowExpansion = (vehicleId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const { vehicles, temperatureTimeline, kpis } = mockData;

  // Prepare data for charts
  const temperatureChartData = temperatureTimeline.map(data => ({
    time: data.time,
    avgTemp: data.avgTemp,
    minTemp: data.minTemp,
    maxTemp: data.maxTemp,
  }));

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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hoy
            </Button>
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
                    {vehicles.map((vehicle) => (
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
