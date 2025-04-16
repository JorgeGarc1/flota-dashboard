
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
    
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
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
