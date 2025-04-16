
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

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
  filterByRange?: boolean;
  startWeek?: number;
  endWeek?: number;
};

export default function BarChart({
  data,
  title,
  className,
  bars,
  xAxisDataKey,
  formatValue = (value) => `$${value.toLocaleString("es-MX")}`,
  stacked = false,
  filterByRange = false,
  startWeek = 0,
  endWeek = 8,
}: BarChartProps) {
  // State for range filter
  const [weeksToShow, setWeeksToShow] = useState<number>(4);
  const [filteredData, setFilteredData] = useState(data);
  
  // Creamos un mapa de nombres para facilitar el acceso en el tooltip
  const namesMap = bars.reduce((acc, bar) => {
    acc[bar.dataKey] = bar.name;
    return acc;
  }, {} as Record<string, string>);

  // Effect to filter data based on weeks
  useEffect(() => {
    if (filterByRange && data.length > 0) {
      const endIndex = data.length;
      const startIndex = Math.max(0, endIndex - weeksToShow);
      setFilteredData(data.slice(startIndex, endIndex));
    } else {
      setFilteredData(data);
    }
  }, [weeksToShow, data, filterByRange]);

  // Custom tooltip that shows colors instead of values
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{label}</p>
        <div className="mt-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center mt-1">
              <div 
                className="w-3 h-3 mr-2" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="mr-2">{namesMap[entry.dataKey] || entry.name}:</span>
              <span className="font-medium">{formatValue(entry.value as number)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate the current week range for the subtitle
  const weekRange = filterByRange && filteredData.length > 0
    ? `Semanas ${filteredData[0][xAxisDataKey]} a ${filteredData[filteredData.length - 1][xAxisDataKey]}`
    : '';

  return (
    <div className={cn("card-dashboard flex flex-col h-full", className)}>
      <div className="mb-4">
        <h3 className="font-montserrat text-xl">{title}</h3>
        {weekRange && <p className="text-sm text-flota-secondary/80 mt-1">{weekRange}</p>}
      </div>
      
      {filterByRange && (
        <div className="mb-4 px-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-flota-secondary">2 semanas</span>
            <span className="text-xs text-flota-secondary">1 trimestre (12 semanas)</span>
          </div>
          <Slider 
            min={2} 
            max={12} 
            step={1} 
            value={[weeksToShow]} 
            onValueChange={(vals) => setWeeksToShow(vals[0])}
            className="my-4"
          />
          <div className="text-center">
            <span className="text-sm font-medium">Mostrando: {weeksToShow} semanas</span>
          </div>
        </div>
      )}
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <RechartsBarChart
            data={filteredData}
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
              content={<CustomTooltip />}
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
