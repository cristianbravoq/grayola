'use client';
import { useActionState } from 'react';
import { signInAction } from 'apps/project-board/src/actions/auth/actions';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [error, formAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      try {
        await signInAction(formData);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : 'Error al iniciar sesión';
      }
    },
    null
  );

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-lg shadow-sm border border-border">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Iniciar sesión</h1>
        <p className="text-muted-foreground mt-2">
          ¿No tienes cuenta?{' '}
          <Link href="/on-boarding" className="text-primary font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-md border bg-destructive/10 border-destructive/20 text-destructive-foreground">
          {error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin size-4" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </form>
    </div>
  );
}