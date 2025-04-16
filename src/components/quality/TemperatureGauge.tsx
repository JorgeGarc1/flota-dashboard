
import React from 'react';
import { cn } from '@/lib/utils';

type TemperatureGaugeProps = {
  value: number;
  min?: number;
  max?: number;
  optimal?: { min: number; max: number };
  compact?: boolean;
};

export default function TemperatureGauge({ 
  value, 
  min = 0, 
  max = 10, 
  optimal = { min: 2, max: 6 },
  compact = false
}: TemperatureGaugeProps) {
  // Calculate percentage for the gauge
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Determine status color based on range
  let statusColor = '';
  if (value < optimal.min) {
    statusColor = 'text-blue-500';
  } else if (value > optimal.max) {
    statusColor = 'text-red-500';
  } else {
    statusColor = 'text-green-500';
  }
  
  return (
    <div className={cn("flex flex-col", compact ? "items-start" : "items-center")}>
      {/* Temperature Value */}
      <div className={cn(
        compact ? "text-3xl font-bold mb-2" : "text-5xl font-bold mb-4", 
        statusColor
      )}>
        {value.toFixed(1)}°C
      </div>
      
      {/* Gauge */}
      <div className="w-full h-6 bg-muted rounded-full overflow-hidden relative">
        {/* Optimal Range Indicator */}
        <div 
          className="absolute h-full bg-green-200/30" 
          style={{ 
            left: `${((optimal.min - min) / (max - min)) * 100}%`,
            width: `${((optimal.max - optimal.min) / (max - min)) * 100}%` 
          }}
        />
        
        {/* Current Temperature Indicator */}
        <div 
          className={cn(
            "absolute w-2 h-full transform -translate-x-1/2", 
            statusColor,
            "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-b-current"
          )} 
          style={{ left: `${percentage}%` }}
        />
        
        {/* Temperature Scale */}
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>{min}°C</span>
          <span>{optimal.min}°C</span>
          <span>{optimal.max}°C</span>
          <span>{max}°C</span>
        </div>
      </div>
      
      {/* Status Text */}
      <div className={cn("mt-4 text-center", compact && "text-sm")}>
        <span className="font-medium">Estado: </span>
        <span className={statusColor}>
          {value < optimal.min ? 'Temperatura Baja' : 
           value > optimal.max ? 'Temperatura Alta' : 
           'Temperatura Óptima'}
        </span>
      </div>
      
      {/* Additional Info */}
      <div className={cn("mt-2 text-xs text-muted-foreground", compact ? "text-left" : "text-center")}>
        Rango óptimo: {optimal.min}°C - {optimal.max}°C
      </div>
    </div>
  );
}
