
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartBar, ChartPie, CalendarCheck, FileText, Menu, X, LogOut, Thermometer, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { theme } = useTheme();

  // Initialize sidebar based on device
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  const navItems = [
    {
      name: 'Dashboard Financiero',
      path: '/dashboard/financiero',
      icon: ChartPie,
    },
    {
      name: 'Dashboard Operativo',
      path: '/dashboard/operativo',
      icon: ChartBar,
    },
    {
      name: 'Control de Calidad',
      path: '/dashboard/calidad',
      icon: Thermometer,
    },
    {
      name: 'Acciones',
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
        className={cn(
          "fixed left-4 bottom-4 z-50 rounded-full p-2 shadow-md lg:hidden",
          theme === 'dark' 
            ? "bg-flota-primary text-black" 
            : "bg-white text-gray-800 border border-gray-200"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full flex-col transition-all duration-300 ease-in-out border-r',
          theme === 'dark' 
            ? 'bg-[#111111] border-flota-secondary/20' 
            : 'bg-white border-gray-200',
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        )}
      >
        <div className={cn(
          "flex h-20 items-center justify-center border-b p-4",
          theme === 'dark' 
            ? "border-flota-secondary/20 bg-black" 
            : "border-gray-200 bg-gray-50"
        )}>
          {isOpen ? (
            <img 
              src="/lovable-uploads/699389bf-72ee-4c06-a8ad-44be8453eab3.png" 
              alt="Teseo Logo" 
              className="h-12 transition-all" 
            />
          ) : (
            <img 
              src="/lovable-uploads/651e8b35-6fec-4a23-abf8-67f0c2816cc5.png" 
              alt="Teseo Logo Icon" 
              className="h-10 transition-all" 
            />
          )}
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
                    ? theme === 'dark' 
                      ? 'bg-flota-primary text-black font-semibold' 
                      : 'bg-amber-100 text-amber-900 font-semibold'
                    : theme === 'dark' 
                      ? 'text-flota-text hover:bg-black/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  location.pathname === item.path
                    ? theme === 'dark' ? 'text-black' : 'text-amber-900'
                    : theme === 'dark' ? 'text-flota-text' : 'text-gray-700'
                )} />
                <span className={cn('transition-opacity', !isOpen && 'lg:hidden')}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className={cn(
          "border-t p-4",
          theme === 'dark' ? "border-flota-secondary/20" : "border-gray-200"
        )}>
          <button
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full",
              theme === 'dark' 
                ? "text-flota-text hover:bg-black/50" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn(
              "h-5 w-5", 
              theme === 'dark' ? "text-flota-danger" : "text-red-600"
            )} />
            <span className={cn('transition-opacity', !isOpen && 'lg:hidden')}>
              Cerrar sesión
            </span>
          </button>
          
          {/* Collapse/Expand Button */}
          <button
            className={cn(
              "flex items-center justify-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full mt-4",
              theme === 'dark' 
                ? "text-flota-text hover:bg-black/50" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Colapsar menú</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
