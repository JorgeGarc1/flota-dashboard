
import React, { useState } from 'react';
import PageHeader from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import {
  Thermometer,
  TruckIcon,
  BellRing,
  CheckCircle,
  AlertTriangle,
  Clock,
  Map,
  BarChart as BarChartIcon,
  FilterIcon,
  Calendar,
  AlertOctagon,
  Building,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import QualityMap from "@/components/quality/QualityMap";
import TemperatureGauge from "@/components/quality/TemperatureGauge";
import AlertsList from "@/components/quality/AlertsList";
import { faker } from '@faker-js/faker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    currentTemp: faker.number.float({ min: 1.5, max: 5.5, fractionDigits: 1 }),
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

  // Temperature timeline data (for the last 24 hours)
  const temperatureTimeline = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - 23 + i);
    
    return {
      time: hour.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      datetime: hour.toISOString(),
      avgTemp: faker.number.float({ min: 2, max: 4.5, fractionDigits: 1 }),
      minTemp: faker.number.float({ min: 1.5, max: 2.5, fractionDigits: 1 }),
      maxTemp: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    };
  });

  // Alerts
  const alertTypes = [
    'Temperatura alta', 
    'Temperatura baja', 
    'Sensor desconectado', 
    'Puerta abierta', 
    'Batería baja'
  ];
  
  const alerts = Array.from({ length: 12 }, (_, i) => ({
    id: `A-${1000 + i}`,
    vehicleId: filteredVehicles[Math.floor(Math.random() * filteredVehicles.length)].id,
    vehicleName: filteredVehicles[Math.floor(Math.random() * filteredVehicles.length)].name,
    type: faker.helpers.arrayElement(alertTypes),
    severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
    value: faker.number.float({ min: 1, max: 7, fractionDigits: 1 }),
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
    status: faker.helpers.arrayElement(['Nueva', 'En revisión', 'Resuelta']),
    cedis: faker.helpers.arrayElement(cedisList.filter(c => c.id !== "all")).id,
    location: {
      zone: faker.helpers.arrayElement(['Norte', 'Sur', 'Este', 'Oeste', 'Centro']),
      address: faker.location.streetAddress({ useFullAddress: true }),
      coords: {
        lat: faker.location.latitude({ min: 19.2, max: 19.6 }),
        lng: faker.location.longitude({ min: -99.4, max: -99.0 }),
      }
    }
  }));

  // Filter alerts by CEDIS if needed
  const filteredAlerts = cedisFilter !== "all" 
    ? alerts.filter(a => a.cedis === cedisFilter) 
    : alerts;

  // KPIs
  const kpis = {
    deliveriesBelow4C: faker.number.int({ min: 180, max: 220 }),
    deliveriesAbove4C: faker.number.int({ min: 10, max: 40 }),
    timeOutOfRange: faker.number.int({ min: 15, max: 60 }), // minutes
    deliveriesWithoutIncidents: faker.number.float({ min: 85, max: 98, fractionDigits: 1 }), // percentage
    averageTemperature: faker.number.float({ min: 2.5, max: 4.2, fractionDigits: 1 }),
  };

  // Alerts by zone
  const alertsByZone = [
    { name: 'Norte', value: faker.number.int({ min: 1, max: 8 }), color: '#FF6384' },
    { name: 'Sur', value: faker.number.int({ min: 1, max: 8 }), color: '#36A2EB' },
    { name: 'Este', value: faker.number.int({ min: 1, max: 8 }), color: '#FFCE56' },
    { name: 'Oeste', value: faker.number.int({ min: 1, max: 8 }), color: '#4BC0C0' },
    { name: 'Centro', value: faker.number.int({ min: 1, max: 8 }), color: '#9966FF' },
  ];

  // Alerts by type
  const alertsByType = alertTypes.map(type => ({
    type,
    count: faker.number.int({ min: 1, max: 10 })
  }));

  // Generate incident histogram data
  const incidentsByWeek = Array.from({ length: 4 }, (_, i) => ({
    period: `Semana ${i + 1}`,
    count: faker.number.int({ min: 5, max: 25 })
  }));

  const incidentsByMonth = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 5 + i);
    return {
      period: date.toLocaleString('es-MX', { month: 'short' }),
      count: faker.number.int({ min: 15, max: 80 })
    };
  });

  return {
    vehicles: filteredVehicles,
    temperatureTimeline,
    alerts: filteredAlerts,
    kpis,
    alertsByZone,
    alertsByType,
    incidentsByWeek,
    incidentsByMonth
  };
};

export default function QualityControlPage() {
  const { theme } = useTheme();
  const [timeFilter, setTimeFilter] = useState('24h');
  const [histogramPeriod, setHistogramPeriod] = useState('week');
  const [selectedCedis, setSelectedCedis] = useState("all");
  const [mockData, setMockData] = useState(generateMockData());

  // Handle CEDIS filter change
  const handleCedisChange = (value: string) => {
    setSelectedCedis(value);
    setMockData(generateMockData(value));
  };

  const { vehicles, temperatureTimeline, alerts, kpis, alertsByZone, alertsByType, incidentsByWeek, incidentsByMonth } = mockData;

  // Filter alerts by severity for the count badges
  const highAlerts = alerts.filter(alert => alert.severity === 'high').length;
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium').length;
  const lowAlerts = alerts.filter(alert => alert.severity === 'low').length;

  // Prepare data for charts
  const temperatureChartData = temperatureTimeline.map(data => ({
    time: data.time,
    avgTemp: data.avgTemp,
    minTemp: data.minTemp,
    maxTemp: data.maxTemp,
  }));

  const alertsBarChartData = alertsByType.map(item => ({
    type: item.type,
    count: item.count
  }));

  // Prepare histogram data based on selected period
  const histogramData = histogramPeriod === 'week' ? incidentsByWeek : incidentsByMonth;

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

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Entregas < 4°C"
                value={kpis.deliveriesBelow4C}
                icon={<CheckCircle className="h-6 w-6" />}
                className="h-full"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Número de pedidos entregados a menos de 4°C</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Entregas > 4°C"
                value={kpis.deliveriesAbove4C}
                icon={<AlertTriangle className="h-6 w-6" />}
                className="h-full"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Número de pedidos entregados a más de 4°C (fuera de rango)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Tiempo Fuera de Rango"
                value={`${kpis.timeOutOfRange} min`}
                icon={<Clock className="h-6 w-6" />}
                className="h-full"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tiempo acumulado fuera del rango óptimo de temperatura</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Sin Incidencias"
                value={`${kpis.deliveriesWithoutIncidents}%`}
                icon={<CheckCircle className="h-6 w-6" />}
                className="h-full"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Porcentaje de entregas sin incidencias reportadas</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Temperatura Promedio"
                value={`${kpis.averageTemperature}°C`}
                icon={<Thermometer className="h-6 w-6" />}
                className="h-full"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Temperatura promedio actual de todos los vehículos</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Main Content Area - Histogram and Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Histogram */}
        <Card className="lg:col-span-2 h-[400px]">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              Incidencias Reportadas por Clientes
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={histogramPeriod === 'week' ? "default" : "outline"} 
                size="sm"
                onClick={() => setHistogramPeriod('week')}
              >
                Semana
              </Button>
              <Button 
                variant={histogramPeriod === 'month' ? "default" : "outline"} 
                size="sm"
                onClick={() => setHistogramPeriod('month')}
              >
                Mes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <BarChart
                data={histogramData}
                title=""
                xAxisDataKey="period"
                formatValue={(value) => `${value}`}
                bars={[
                  { dataKey: 'count', name: 'Incidencias', color: '#FF6384' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Temperature Gauge and Alerts Summary */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Estado de Temperatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureGauge value={kpis.averageTemperature} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertOctagon className="h-5 w-5" />
                Resumen de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Críticas</span>
                  <span className="text-2xl font-bold text-red-500">{highAlerts}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Advertencias</span>
                  <span className="text-2xl font-bold text-amber-500">{mediumAlerts}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Informativas</span>
                  <span className="text-2xl font-bold text-blue-500">{lowAlerts}</span>
                </div>
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
              <BarChartIcon className="h-5 w-5" />
              Evolución de Temperatura
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

      {/* Tabs for Alerts and Analytics */}
      <Tabs defaultValue="alerts" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="alerts">Alertas e Incidencias</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <AlertsList alerts={alerts} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Alertas por Zona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <DoughnutChart
                    data={alertsByZone}
                    title=""
                    formatValue={(value) => `${value}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Alertas por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={alertsBarChartData}
                    title=""
                    xAxisDataKey="type"
                    formatValue={(value) => `${value}`}
                    bars={[
                      { dataKey: 'count', name: 'Cantidad', color: '#FF6384' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
