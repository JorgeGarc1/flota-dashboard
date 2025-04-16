
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DoughnutChart from "@/components/charts/DoughnutChart";
import BarChart from "@/components/charts/BarChart";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  gastosPorCategoria, 
  ingresosVsGastosSemanales,
  topUnidadesGasto,
} from "@/data/mock-data";

export default function FinancieroPage() {
  // Formatear para mostrar en pesos mexicanos
  const formatPesos = (value: number) => `$${value.toLocaleString("es-MX")}`;

  // Obtener la semana actual y fechas
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  // Formato de fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Obtener número de semana del año
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  const currentWeek = getWeekNumber(currentDate);
  const weekSubtitle = `Semana ${currentWeek}: ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

  // Configuración para el gráfico de barras apilado
  const stackedBarChartBars = [
    { dataKey: "combustible", name: "Combustible", color: "#FF9900" },
    { dataKey: "mantenimiento", name: "Mantenimiento", color: "#6F797F" },
    { dataKey: "casetas", name: "Casetas", color: "#444444" },
    { dataKey: "imponderables", name: "Imponderables", color: "#666666" },
  ];

  // Crear cuentas específicas actualizadas con las categorías solicitadas
  const cuentasActualizadas = [
    { nombre: "Mantenimiento", saldo: 125000, presupuesto: 150000 },
    { nombre: "Combustible", saldo: 85000, presupuesto: 100000 },
    { nombre: "Casetas", saldo: 45000, presupuesto: 50000 },
    { nombre: "Imponderables", saldo: 32000, presupuesto: 25000 }
  ];

  // Calcular saldo total
  const saldoTotal = cuentasActualizadas.reduce((total, cuenta) => total + cuenta.saldo, 0);

  return (
    <div>
      <PageHeader 
        title="Dashboard Financiero" 
        subtitle="Análisis financiero de la flota y sus operaciones"
      />

      {/* Indicadores financieros específicos */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {cuentasActualizadas.map((cuenta) => (
          <StatCard
            key={cuenta.nombre}
            title={cuenta.nombre}
            value={formatPesos(cuenta.saldo)}
            reference={`Presupuesto: ${formatPesos(cuenta.presupuesto)}`}
          />
        ))}
        <StatCard 
          title="Saldo Total en Cuentas"
          value={formatPesos(saldoTotal)}
          className="bg-flota-primary/10 border-flota-primary/30"
        />
      </div>

      {/* Gráficos reorganizados según lo solicitado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DoughnutChart 
          data={gastosPorCategoria} 
          title="Gastos semanales por categoría"
          subtitle={weekSubtitle}
          formatValue={formatPesos}
          showValues={true}
        />
        
        {/* Top 10 unidades con mayor gasto (movido a la derecha) */}
        <div className="card-dashboard">
          <h3 className="font-montserrat text-xl mb-4">Top 10 Unidades con Mayor Gasto Semanal</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Ranking</TableHead>
                <TableHead>Número Eco</TableHead>
                <TableHead className="text-right">Gasto Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topUnidadesGasto.map((unidad) => (
                <TableRow key={unidad.numeroEco}>
                  <TableCell className="font-medium">{unidad.ranking}</TableCell>
                  <TableCell>{unidad.numeroEco}</TableCell>
                  <TableCell className="text-right">{formatPesos(unidad.gastoTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Gráfico de gastos semanales (movido abajo) */}
      <div className="mb-6">
        <BarChart 
          data={ingresosVsGastosSemanales}
          title="Gastos Semanales por Categoría"
          bars={stackedBarChartBars}
          xAxisDataKey="semana"
          formatValue={formatPesos}
          stacked={true}
          filterByRange={true}
        />
      </div>
    </div>
  );
}
