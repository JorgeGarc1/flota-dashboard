
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

type BarChartProps = {
  data: any[];
  title: string;
  className?: string;
  bars: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  xAxisDataKey: string;
  formatValue?: (value: number) => string;
  stacked?: boolean;
};

export default function BarChart({
  data,
  title,
  className,
  bars,
  xAxisDataKey,
  formatValue = (value) => `$${value.toLocaleString("es-MX")}`,
  stacked = false,
}: BarChartProps) {
  // Creamos un mapa de nombres para facilitar el acceso en el tooltip
  const namesMap = bars.reduce((acc, bar) => {
    acc[bar.dataKey] = bar.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className={cn("card-dashboard flex flex-col h-full", className)}>
      <h3 className="font-montserrat text-xl mb-4">{title}</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis tickFormatter={formatValue} />
            <Tooltip 
              formatter={(value: number, name: string) => [formatValue(value), namesMap[name] || name]} 
              labelFormatter={(label) => `Semana: ${label}`}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color}
                stackId={stacked ? "a" : undefined}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
