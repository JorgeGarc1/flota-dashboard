
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

type DoughnutChartProps = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title: string;
  className?: string;
  formatValue?: (value: number) => string;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
};

export default function DoughnutChart({
  data,
  title,
  className,
  formatValue = (value) => `$${value.toLocaleString("es-MX")}`,
  showLegend = true,
  innerRadius = 60,
  outerRadius = 80,
}: DoughnutChartProps) {
  return (
    <div className={cn("card-dashboard flex flex-col h-full", className)}>
      <h3 className="font-montserrat text-xl mb-4">{title}</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [formatValue(value), 'Valor']}
            />
            {showLegend && (
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
