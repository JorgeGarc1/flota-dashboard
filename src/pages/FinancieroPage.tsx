
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DoughnutChart from "@/components/charts/DoughnutChart";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  gastosPorCategoria, 
  ingresosVsGastosMensuales, 
  saldosTiempo,
  cuentasResumen 
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

  // Configuración para el gráfico de barras
  const barChartBars = [
    { dataKey: "ingresos", name: "Ingresos", color: "#FF9900" },
    { dataKey: "gastos", name: "Gastos", color: "#DB0000" },
  ];

  // Configuración para el gráfico de líneas
  const lineChartLines = [
    { dataKey: "saldo", name: "Saldo", color: "#FF9900" },
  ];

  // Columnas para la tabla de resumen de cuentas
  const cuentasColumns = [
    { header: "Cuenta", accessor: "cuenta" },
    { 
      header: "Ingresos", 
      accessor: "ingresos",
      cell: (value: number) => formatPesos(value)
    },
    { 
      header: "Gastos", 
      accessor: "gastos",
      cell: (value: number) => formatPesos(value)
    },
    { 
      header: "Saldo", 
      accessor: "saldo",
      cell: (value: number) => (
        <span className="font-medium text-flota-primary">{formatPesos(value)}</span>
      )
    },
  ];

  // Calcular saldo total
  const saldoTotal = cuentasResumen.reduce((total, cuenta) => total + cuenta.saldo, 0);

  return (
    <div>
      <PageHeader 
        title="Dashboard Financiero" 
        subtitle="Análisis financiero de la flota y sus operaciones"
      />

      {/* Resumen financiero */}
      <div className="card-dashboard mb-6">
        <h3 className="font-montserrat text-xl mb-4">Resumen Financiero</h3>
        <div className="text-3xl font-bold font-montserrat text-flota-primary">
          {formatPesos(saldoTotal)}
        </div>
        <div className="text-sm text-flota-secondary mt-1">
          Saldo total en cuentas
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DoughnutChart 
          data={gastosPorCategoria} 
          title="Gastos por Categoría"
          formatValue={formatPesos}
        />
        <BarChart 
          data={ingresosVsGastosMensuales} 
          title="Ingresos vs Gastos Mensuales"
          bars={barChartBars}
          xAxisDataKey="mes"
          formatValue={formatPesos}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <LineChart 
          data={saldosTiempo} 
          title="Saldos a lo Largo del Tiempo"
          lines={lineChartLines}
          xAxisDataKey="fecha"
          formatValue={formatPesos}
        />
        <DataTable 
          data={cuentasResumen} 
          columns={cuentasColumns}
          title="Desglose por Cuenta"
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
          onClick={() => handleShowData(ingresosVsGastosMensuales, "Datos de Ingresos vs Gastos")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Ingresos/Gastos
        </Button>
        <Button 
          onClick={() => handleShowData(saldosTiempo, "Datos de Saldos a lo Largo del Tiempo")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Saldos
        </Button>
      </div>
    </div>
  );
}
