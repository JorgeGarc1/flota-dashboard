
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

type LineChartProps = {
  data: any[];
  title: string;
  className?: string;
  lines: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  xAxisDataKey: string;
  formatValue?: (value: number) => string;
};

export default function LineChart({
  data,
  title,
  className,
  lines,
  xAxisDataKey,
  formatValue = (value) => `$${value.toLocaleString("es-MX")}`,
}: LineChartProps) {
  return (
    <div className={cn("card-dashboard flex flex-col h-full", className)}>
      <h3 className="font-montserrat text-xl mb-4">{title}</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <RechartsLineChart
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
            <Tooltip formatter={(value: number) => [formatValue(value), 'Valor']} />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                activeDot={{ r: 8 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
