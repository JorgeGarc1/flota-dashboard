
import { cn } from "@/lib/utils";
import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  reference?: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  tertiaryValue?: string | number;
  tertiaryLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function StatCard({ 
  title, 
  value, 
  description, 
  reference, 
  secondaryValue,
  secondaryLabel,
  tertiaryValue,
  tertiaryLabel,
  icon, 
  className, 
  children 
}: StatCardProps) {
  return (
    <div className={cn("card-stat shadow-sm hover:shadow-md transition-all duration-300", className)}>
      {icon && <div className="mb-3 text-flota-primary">{icon}</div>}
      <div className="text-3xl md:text-4xl font-bold font-montserrat format-number text-center text-flota-primary">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-flota-secondary text-center">
        {title}
      </div>
      {reference && (
        <div className="mt-1 text-sm text-flota-secondary/70 text-center">
          {reference}
        </div>
      )}
      {description && (
        <div className="mt-2 text-xs text-flota-secondary/70 text-center">
          {description}
        </div>
      )}
      
      {/* Secondary and tertiary values */}
      {(secondaryValue || tertiaryValue) && (
        <div className="mt-3 pt-3 border-t border-flota-secondary/10">
          {secondaryValue && secondaryLabel && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-flota-secondary">{secondaryLabel}:</span>
              <span className="text-sm font-medium">{secondaryValue}</span>
            </div>
          )}
          {tertiaryValue && tertiaryLabel && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-flota-secondary">{tertiaryLabel}:</span>
              <span className="text-sm font-medium">{tertiaryValue}</span>
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
}
