
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-flota-background text-flota-text flex">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 p-6 lg:ml-20 transition-all", 
          isMobile ? "" : ""
        )}
      >
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
