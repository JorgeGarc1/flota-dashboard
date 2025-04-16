import React, { useState } from 'react';
import PageHeader from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LineChart from "@/components/charts/LineChart";
import {
  Thermometer,
  TruckIcon,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Building,
  FilterIcon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { faker } from '@faker-js/faker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TemperatureGauge from "@/components/quality/TemperatureGauge";

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
  // Vehicles data
  const vehicles = Array.from({ length: 15 }, (_, i) => ({
    id: `V-${1000 + i}`,
    name: `Vehículo ${i + 1}`,
    type: faker.helpers.arrayElement(['Refrigerado', 'Congelado', 'Mixto']),
    status: faker.helpers.arrayElement(['Óptimo', 'Advertencia', 'Alerta']),
    currentTemp: faker.number.float({ min: 1.5, max: 6.5, fractionDigits: 1 }),
    targetTemp: faker.helpers.arrayElement([2, 3, 4]),
    cedis: faker.helpers.arrayElement(cedisList.filter(c => c.id !== "all")).id,
    location: {
      lat: faker.location.latitude({ min: 19.2, max: 19.6 }),
      lng: faker.location.longitude({ min: -99.4, max: -99.0 }),
    },
    lastUpdate: faker.date.recent({ days: 1 }).toISOString(),
  }));

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

  // Handle CEDIS filter change
  const handleCedisChange = (value: string) => {
    setSelectedCedis(value);
    setMockData(generateMockData(value));
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

      {/* KPIs Row - We're keeping only the first two indicators as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      </div>

      {/* Main Content Area - Only Temperature Gauge */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="h-[400px]">
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
            />
          </CardContent>
        </Card>
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
