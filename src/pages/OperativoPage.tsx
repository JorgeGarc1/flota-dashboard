
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DoughnutChart from "@/components/charts/DoughnutChart";
import LineChart from "@/components/charts/LineChart";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  viajesPorCliente,
  viajesPorCamion,
  viajesDiarios,
  kpisOperativos,
} from "@/data/mock-data";
import { AlertTriangle, Truck, Fuel, Package } from "lucide-react";

export default function OperativoPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [dialogTitle, setDialogTitle] = useState("");

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

  return (
    <div>
      <PageHeader 
        title="Eficiencia Operativa" 
        subtitle="Métricas de operación de la flota"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Incidencias"
          value={kpisOperativos.incidencias}
          description="Total en el período"
          icon={<AlertTriangle size={32} />}
        />
        <StatCard 
          title="Kilómetros Totales"
          value={kpisOperativos.kilometros.toLocaleString("es-MX")}
          description="Recorridos en el período"
          icon={<Truck size={32} />}
        />
        <StatCard 
          title="Litros de Combustible"
          value={kpisOperativos.combustible.toLocaleString("es-MX")}
          description="Comprados en el período"
          icon={<Fuel size={32} />}
        />
        <StatCard 
          title="Pedidos Entregados"
          value={kpisOperativos.pedidosEntregados}
          description="Total en el período"
          icon={<Package size={32} />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DoughnutChart 
          data={viajesPorCliente} 
          title="Viajes por Cliente"
          formatValue={formatViajes}
        />
        <DoughnutChart 
          data={viajesPorCamion} 
          title="Viajes por Camión"
          formatValue={formatViajes}
        />
      </div>

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
          onClick={() => handleShowData(viajesPorCliente, "Datos de Viajes por Cliente")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Clientes
        </Button>
        <Button 
          onClick={() => handleShowData(viajesPorCamion, "Datos de Viajes por Camión")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Camiones
        </Button>
        <Button 
          onClick={() => handleShowData(viajesDiarios, "Datos de Viajes Diarios")}
          variant="outline"
          className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
        >
          Ver Datos de Viajes Diarios
        </Button>
      </div>
    </div>
  );
}
