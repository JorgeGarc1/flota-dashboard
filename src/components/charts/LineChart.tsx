
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
    yAxisId?: string;
  }[];
  xAxisDataKey: string;
  formatValue?: (value: number) => string;
  formatSecondaryValue?: (value: number) => string;
  showSecondaryAxis?: boolean;
};

export default function LineChart({
  data,
  title,
  className,
  lines,
  xAxisDataKey,
  formatValue = (value) => `$${value.toLocaleString("es-MX")}`,
  formatSecondaryValue = (value) => `${value.toLocaleString("es-MX")}`,
  showSecondaryAxis = false,
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
            
            {/* Primary Y-axis (left) */}
            <YAxis 
              yAxisId="left" 
              tickFormatter={formatValue} 
              orientation="left"
            />
            
            {/* Secondary Y-axis (right) - only shown if enabled */}
            {showSecondaryAxis && (
              <YAxis 
                yAxisId="right" 
                tickFormatter={formatSecondaryValue} 
                orientation="right"
              />
            )}
            
            <Tooltip 
              formatter={(value: number, name: string, props: { dataKey: string, payload: any }) => {
                const lineConfig = lines.find(line => line.dataKey === props.dataKey);
                const formatter = lineConfig?.yAxisId === "right" ? formatSecondaryValue : formatValue;
                return [formatter(value), name];
              }} 
            />
            <Legend />
            
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                activeDot={{ r: 8 }}
                yAxisId={line.yAxisId || "left"}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
