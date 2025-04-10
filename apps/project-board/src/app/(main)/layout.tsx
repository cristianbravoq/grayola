import { EnvVarWarning } from '../../components/auth/env-var-warning';
import { UserMenu } from '../../components/auth/header-auth';
import { hasEnvVars } from '../../lib/supabase/check-env-vars';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className='flex justify-end m-4'>{!hasEnvVars ? <EnvVarWarning /> : <UserMenu />}</div>
      <div className="flex flex-row">
        {children}
      </div>
    </div>
  );
}
