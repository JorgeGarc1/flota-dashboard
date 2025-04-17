import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Inicio de sesión exitoso');
        navigate('/dashboard/financiero');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('Por favor ingresa email y contraseña');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: email.split('@')[0],
            apellido: '',
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Registro exitoso. Por favor verifica tu correo electrónico.');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard/financiero`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || `Error al iniciar sesión con ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-flota-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/b8d080d2-83b9-40dc-a38d-f1c6a0e4d2a0.png" 
            alt="Teseo Logo" 
            className="h-20" 
          />
        </div>
        
        <div className="bg-black/40 p-8 rounded-lg border border-flota-secondary/20 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6 font-montserrat">
            Iniciar Sesión
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-flota-text mb-1">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border-flota-secondary/30 text-flota-text"
                placeholder="tu@correo.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-flota-text mb-1">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border-flota-secondary/30 text-flota-text"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1 bg-flota-primary hover:bg-flota-primary/90 text-black font-bold"
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
              
              <Button 
                type="button"
                onClick={() => navigate('/register')}
                className="flex-1 bg-flota-secondary hover:bg-flota-secondary/90 text-white font-bold"
                disabled={isLoading}
              >
                Registrarse
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
