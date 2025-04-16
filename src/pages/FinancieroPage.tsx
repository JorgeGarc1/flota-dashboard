
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DoughnutChart from "@/components/charts/DoughnutChart";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { 
  gastosPorCategoria, 
  ingresosVsGastosMensuales,
  ingresosVsGastosSemanales,
  saldosTiempo,
  saldosHistoricos,
} from "@/data/mock-data";

export default function FinancieroPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [dialogTitle, setDialogTitle] = useState("");

  const handleShowData = (data: any[], title: string) => {
    setDialogData(data);
    setDialogTitle(title);
    setIsDialogOpen(true);
  };

  // Formatear para mostrar en pesos mexicanos
  const formatPesos = (value: number) => `$${value.toLocaleString("es-MX")}`;

  // Configuración para el gráfico de barras apilado
  const stackedBarChartBars = [
    { dataKey: "combustible", name: "Combustible", color: "#FF9900" },
    { dataKey: "mantenimiento", name: "Mantenimiento", color: "#6F797F" },
    { dataKey: "seguros", name: "Seguros", color: "#444444" },
    { dataKey: "imponderables", name: "Imponderables", color: "#666666" },
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DoughnutChart 
          data={gastosPorCategoria} 
          title="Gastos por Categoría"
          formatValue={formatPesos}
          showValues={true}
        />
        <BarChart 
          data={ingresosVsGastosSemanales} 
          title="Gastos Semanales por Categoría"
          bars={stackedBarChartBars}
          xAxisDataKey="semana"
          formatValue={formatPesos}
          stacked={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
        <LineChart 
          data={saldosHistoricos} 
          title="Saldos Históricos"
          lines={lineChartLines}
          xAxisDataKey="fecha"
          formatValue={formatPesos}
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
                        {typeof value === 'number' && (key === 'ingresos' || key === 'gastos' || key === 'saldo' || key === 'value' || key === 'combustible' || key === 'mantenimiento' || key === 'seguros' || key === 'imponderables')
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
          onClick={() => handleShowData(ingresosVsGastosSemanales, "Datos de Gastos Semanales por Categoría")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Gastos Semanales
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
