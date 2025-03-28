import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DoughnutChart from "@/components/charts/DoughnutChart";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatCard } from "@/components/ui/stat-card";
import { 
  gastosPorCategoria, 
  ingresosVsGastosMensuales,
  ingresosVsGastosSemanales,
  saldosTiempo,
  saldosHistoricos,
  cuentasResumen,
  cuentasEspecificas
} from "@/data/mock-data";

export default function FinancieroPage() {
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

  // Formatear para mostrar en pesos mexicanos
  const formatPesos = (value: number) => `$${value.toLocaleString("es-MX")}`;

  // Configuración para el gráfico de barras
  const barChartBars = [
    { dataKey: "ingresos", name: "Ingresos", color: "#FF9900" },
    { dataKey: "gastos", name: "Gastos", color: "#DB0000" },
  ];

  // Configuración para el gráfico de líneas
  const lineChartLines = [
    { dataKey: "saldo", name: "Saldo", color: "#FF9900" },
  ];

  // Crear cuentas específicas actualizadas con las categorías solicitadas
  const cuentasActualizadas = [
    { nombre: "Mantenimiento", saldo: 125000, presupuesto: 150000 },
    { nombre: "Combustible", saldo: 85000, presupuesto: 100000 },
    { nombre: "Casetas", saldo: 45000, presupuesto: 50000 },
    { nombre: "No Deducibles", saldo: 32000, presupuesto: 25000 }
  ];

  // Calcular saldo total
  const saldoTotal = cuentasActualizadas.reduce((total, cuenta) => total + cuenta.saldo, 0);

  // Paginación de datos
  const paginateData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(cuentasResumen.length / itemsPerPage);

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

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DoughnutChart 
          data={gastosPorCategoria} 
          title="Gastos por Categoría"
          formatValue={formatPesos}
        />
        <BarChart 
          data={ingresosVsGastosSemanales} 
          title="Ingresos vs Gastos Semanales"
          bars={barChartBars}
          xAxisDataKey="semana"
          formatValue={formatPesos}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <LineChart 
          data={saldosHistoricos} 
          title="Saldos Históricos"
          lines={lineChartLines}
          xAxisDataKey="fecha"
          formatValue={formatPesos}
        />
        <div className="card-dashboard">
          <h3 className="font-montserrat text-xl mb-4">Desglose por Cuenta</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-flota-text bg-black/40 border-b border-flota-secondary/20">
                <tr>
                  <th className="px-4 py-3 font-montserrat">Cuenta</th>
                  <th className="px-4 py-3 font-montserrat">Ingresos</th>
                  <th className="px-4 py-3 font-montserrat">Gastos</th>
                  <th className="px-4 py-3 font-montserrat">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(cuentasResumen).map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="border-b border-flota-secondary/10 hover:bg-black/30"
                  >
                    <td className="px-4 py-3">{row.cuenta}</td>
                    <td className="px-4 py-3">{formatPesos(row.ingresos)}</td>
                    <td className="px-4 py-3">{formatPesos(row.gastos)}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-flota-primary">{formatPesos(row.saldo)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    <th key={key} className="px-4 py-3 font-montserrat">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
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
                      <td key={key} className="px-4 py-3">
                        {typeof value === 'number' && (key === 'ingresos' || key === 'gastos' || key === 'saldo' || key === 'value')
                          ? formatPesos(value as number)
                          : value as React.ReactNode}
                      </td>
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
          onClick={() => handleShowData(gastosPorCategoria, "Datos de Gastos por Categoría")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Gastos
        </Button>
        <Button 
          onClick={() => handleShowData(ingresosVsGastosSemanales, "Datos de Ingresos vs Gastos Semanales")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Ingresos/Gastos
        </Button>
        <Button 
          onClick={() => handleShowData(saldosHistoricos, "Datos de Saldos Históricos")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Saldos
        </Button>
      </div>
    </div>
  );
}
