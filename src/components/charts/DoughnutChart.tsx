
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts";
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
  showValues?: boolean;
};

export default function DoughnutChart({
  data,
  title,
  className,
  formatValue = (value) => `$${value.toLocaleString("es-MX")}`,
  showLegend = true,
  innerRadius = 60,
  outerRadius = 80,
  showValues = false,
}: DoughnutChartProps) {
  // Custom label for pie chart segments
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }: any) => {
    if (!showValues) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={data[index].color}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {formatValue(value)}
      </text>
    );
  };

  // Calcula el valor total para mostrar en el centro
  const total = data.reduce((sum, item) => sum + item.value, 0);

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
              labelLine={showValues}
              label={renderCustomizedLabel}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                position="center"
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan x={cx} y={cy - 10} fill="#666" fontSize="12" textAnchor="middle">
                        Total
                      </tspan>
                      <tspan x={cx} y={cy + 10} fill="#333" fontSize="14" fontWeight="bold" textAnchor="middle">
                        {formatValue(total)}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [formatValue(value), name]}
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
