
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartBar, ChartPie, CalendarCheck, FileText, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Estado inicial del sidebar basado en dispositivo
  useState(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    {
      name: 'Dashboard Financiero',
      path: '/dashboard/financiero',
      icon: ChartPie,
    },
    {
      name: 'Eficiencia Operativa',
      path: '/dashboard/operativo',
      icon: ChartBar,
    },
    {
      name: 'Acciones Ejecutivas',
      path: '/acciones',
      icon: FileText,
    },
    {
      name: 'Agenda',
      path: '/agenda',
      icon: CalendarCheck,
    },
  ];

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-full bg-flota-primary p-2 text-black shadow-md lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-sidebar border-r border-flota-secondary/20 transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        )}
      >
        <div className="flex h-20 items-center justify-center border-b border-flota-secondary/20 p-4">
          <img 
            src="/lovable-uploads/b8d080d2-83b9-40dc-a38d-f1c6a0e4d2a0.png" 
            alt="Teseo Logo" 
            className={cn("h-12 transition-all", !isOpen && "lg:h-10")} 
          />
        </div>

        <div className="flex-grow p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-flota-primary text-black font-semibold'
                    : 'text-flota-text hover:bg-black/50'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn('transition-opacity', !isOpen && 'lg:hidden')}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-flota-secondary/20 p-4">
          <button
            className="hidden lg:flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full text-flota-text hover:bg-black/50"
            onClick={toggleSidebar}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className={cn('transition-opacity', !isOpen && 'lg:hidden')}>
              Colapsar menú
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
