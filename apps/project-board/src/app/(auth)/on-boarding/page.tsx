'use client';
import { supabase } from "apps/project-board/src/lib/supabase";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { Loader2 } from 'lucide-react';

// Esquema de validación con Zod
const formSchema = z.object({
  email: z.string().email('Ingresa un email válido').min(1, 'El email es requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  role: z.enum(['client', 'manager', 'designer'], {
    required_error: 'Debes seleccionar un rol',
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'client'
    }
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // 1. Registrar al usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // 2. Obtener el ID del rol seleccionado
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', data.role)
        .single();

      if (roleError) throw roleError;

      if (!authData.user || !roleData) {
        throw new Error('Error al obtener datos del usuario o rol.');
      }

      // 3. Guardar el perfil del usuario con el rol
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          role_id: roleData.id,
        });

      if (profileError) throw profileError;

      setMessage({
        type: 'success',
        content: '¡Registro exitoso! Por favor verifica tu email.',
      });
      reset();
    } catch (error: any) {
      setMessage({
        type: 'error',
        content: error.message || 'Ocurrió un error durante el registro',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-lg shadow-sm border border-border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Crea tu cuenta</h2>
        <p className="text-muted-foreground mt-2">Empieza a gestionar tus proyectos</p>
      </div>

      {message.content && (
        <div
          className={`p-4 mb-6 rounded-md border ${
            message.type === 'error'
              ? 'bg-destructive/10 border-destructive/20 text-destructive-foreground'
              : 'bg-primary/10 border-primary/20 text-primary-foreground'
          }`}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            <p>La contraseña debe contener:</p>
            <ul className="list-disc list-inside">
              <li className={errors.password?.type === 'min' ? 'text-destructive' : ''}>
                Mínimo 8 caracteres
              </li>
              <li className={errors.password?.message?.includes('mayúscula') ? 'text-destructive' : ''}>
                Al menos una mayúscula
              </li>
              <li className={errors.password?.message?.includes('minúscula') ? 'text-destructive' : ''}>
                Al menos una minúscula
              </li>
              <li className={errors.password?.message?.includes('número') ? 'text-destructive' : ''}>
                Al menos un número
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
            Tipo de cuenta
          </label>
          <select
            id="role"
            {...register('role')}
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="client">Cliente</option>
            <option value="manager">Project Manager</option>
            <option value="designer">Diseñador</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin size-4" />
              Creando cuenta...
            </>
          ) : (
            'Registrarse ahora'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <a href="/sign-in" className="text-primary hover:underline">
          Inicia sesión
        </a>
      </div>
    </div>
  );
}