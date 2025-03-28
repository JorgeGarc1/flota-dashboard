
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  className,
  actions
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4", className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-flota-text">{title}</h1>
        {subtitle && (
          <p className="text-flota-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
