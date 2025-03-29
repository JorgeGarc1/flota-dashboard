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
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-flota-secondary/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-flota-secondary">
                  O continúa con
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleSocialLogin('google')}
                className="bg-black/60 border-flota-secondary/30 text-flota-text hover:bg-black/80"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                  />
                </svg>
                Google
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleSocialLogin('facebook')}
                className="bg-black/60 border-flota-secondary/30 text-flota-text hover:bg-black/80"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-5 w-5 mr-2 fill-[#1877F2]">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
