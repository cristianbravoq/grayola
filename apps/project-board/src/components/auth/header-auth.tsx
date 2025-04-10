'use client';

import {
  User,
  LogIn,
  LogOut,
  UserPlus,
  Moon,
  Sun,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui';
import { Skeleton } from '@ui';

import { useRouter } from 'next/navigation';
import { signOutAction } from '../../actions/auth/actions';
import { createClient } from '../../lib/supabase/client';

export function UserMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Obtener el rol del usuario
        const { data: roleData, error } = await supabase
          .from('user_profiles')
          .select('roles(name)')
          .eq('user_id', user.id)
          .single();

        if (!error && roleData?.roles) {
          throw new Error('Error fetching user role');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutAction();
    router.refresh();
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="gap-2">
          <Link href="/sign-in">
            <LogIn className="h-4 w-4" />
            <span>Sign in</span>
          </Link>
        </Button>
        <Button asChild size="sm" className="gap-2">
          <Link href="/sign-up">
            <UserPlus className="h-4 w-4" />
            <span>Sign up</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-secondary/20 hover:scale-105 transition-transform duration-200 ease-in-out" 
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <UserIcon className="h-4 w-4" />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-popover border-border"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal bg-accent/60 rounded-sm">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            {userRole && (
              <p className="text-xs leading-none text-muted-foreground">
                Rol: <span className="capitalize">{userRole}</span>
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        {/* <DropdownMenuItem className="focus:bg-secondary/10 focus:text-secondary-foreground">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="focus:bg-secondary/10 focus:text-secondary-foreground">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="focus:bg-secondary/10 focus:text-secondary-foreground"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Tema claro</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Tema oscuro</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" /> */}

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
