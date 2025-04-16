
import { cn } from "@/lib/utils";
import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  reference?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function StatCard({ title, value, description, reference, icon, className, children }: StatCardProps) {
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
      {children}
    </div>
  );
}
