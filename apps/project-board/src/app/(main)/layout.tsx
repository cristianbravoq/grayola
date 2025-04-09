import { EnvVarWarning } from '../../components/auth/env-var-warning';
import HeaderAuth from '../../components/auth/header-auth';
import { hasEnvVars } from '../../lib/supabase/check-env-vars';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen">
      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      <div className="flex flex-row">
        {children}
      </div>
    </div>
  );
}
