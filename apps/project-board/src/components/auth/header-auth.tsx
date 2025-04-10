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
import { Button } from '@ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui';
import { useRouter } from 'next/navigation';
import { signOutAction } from '../../actions/auth/actions';
import { useUserStore } from '../../store/auth-store';

export function UserMenu() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { role, email } = useUserStore();

  const handleSignOut = async () => {
    await signOutAction();
    router.refresh();
  };

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
            <p className="text-sm font-medium leading-none">{email}</p>
            {role && (
              <p className="text-xs leading-none text-muted-foreground">
                Rol: <span className="capitalize">{role}</span>
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
