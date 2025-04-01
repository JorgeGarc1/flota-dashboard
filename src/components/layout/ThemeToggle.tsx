
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle 
      pressed={theme === 'light'}
      onPressedChange={toggleTheme}
      className={cn(
        "rounded-full w-10 h-10 p-0 flex items-center justify-center",
        theme === 'dark' 
          ? "bg-flota-secondary/50 text-flota-primary hover:bg-flota-secondary/30" 
          : "bg-amber-200 text-amber-700 hover:bg-amber-300"
      )}
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Toggle>
  );
}
