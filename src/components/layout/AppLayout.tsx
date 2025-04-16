
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Mic } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function AppLayout() {
  const isMobile = useIsMobile();
  const [isListening, setIsListening] = useState(false);

  const toggleMic = () => {
    setIsListening(!isListening);
    // Aquí iría la lógica para iniciar/detener el reconocimiento de voz
  };

  return (
    <div className="min-h-screen bg-flota-background text-flota-text flex">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 p-6 lg:ml-20 transition-all", 
          isMobile ? "" : ""
        )}
      >
        <div className="w-full flex justify-center mb-6">
          <div className="flex items-center justify-between rounded-full px-4 py-2 gradient-animation shadow-lg max-w-md w-full">
            <style jsx>{`
              @keyframes gradientAnimation {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
              
              .gradient-animation {
                background: linear-gradient(45deg, #FF9900, #FF6B6B, #FF4500, #FF6B6B);
                background-size: 300% 300%;
                animation: gradientAnimation 8s ease infinite;
              }
            `}</style>
            <img 
              src="/lovable-uploads/3dd8b1f8-c8c9-4ed6-b98c-f20a78ea5224.png" 
              alt="Teseo Logo" 
              className="h-10" 
            />
            <div className="flex items-center gap-3">
              <button 
                className={cn(
                  "rounded-full p-2 transition-all", 
                  isListening 
                    ? "bg-red-600 text-white animate-pulse" 
                    : "bg-black/30 text-white hover:bg-black/50"
                )}
                onClick={toggleMic}
              >
                <Mic size={18} />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
