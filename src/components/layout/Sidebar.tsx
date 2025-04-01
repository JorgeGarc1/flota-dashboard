
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartBar, ChartPie, CalendarCheck, FileText, Menu, X, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

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
        className="fixed left-4 top-4 z-50 rounded-full bg-flota-primary p-2 text-black shadow-md lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-[#111111] border-r border-flota-secondary/20 transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        )}
      >
        <div className="flex h-20 items-center justify-center border-b border-flota-secondary/20 p-4 bg-black">
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
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full text-flota-text hover:bg-black/50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-flota-danger" />
            <span className={cn('transition-opacity', !isOpen && 'lg:hidden')}>
              Cerrar sesión
            </span>
          </button>
          
          <button
            className="hidden lg:flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full text-flota-text hover:bg-black/50 mt-4"
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
