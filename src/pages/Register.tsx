
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            apellido,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Registro exitoso. Por favor verifica tu correo electrónico para completar el registro.');
        navigate('/login');
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.error('Este correo electrónico ya está registrado');
      } else {
        toast.error(error.message || 'Error al registrarse');
      }
    } finally {
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
          <Link 
            to="/login" 
            className="inline-flex items-center text-flota-secondary hover:text-flota-primary mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio de sesión
          </Link>
          
          <h1 className="text-2xl font-bold text-center mb-6 font-montserrat">
            Crear nueva cuenta
          </h1>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre" className="text-flota-text mb-1">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-black/40 border-flota-secondary/30 text-flota-text"
                  placeholder="Juan"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="apellido" className="text-flota-text mb-1">
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="bg-black/40 border-flota-secondary/30 text-flota-text"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-flota-text mb-1">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-flota-secondary/30 text-flota-text"
                placeholder="tu@correo.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-flota-text mb-1">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border-flota-secondary/30 text-flota-text"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-flota-text mb-1">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black/40 border-flota-secondary/30 text-flota-text"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-2 bg-flota-primary hover:bg-flota-primary/90 text-black font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarme'}
            </Button>
            
            <p className="text-center text-sm text-flota-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-flota-primary hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
