import { createClient } from 'apps/project-board/src/lib/supabase/server';
import { DashboardView } from 'apps/project-board/src/views/dashboard/dashboard-view';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Grayola',
  description: 'Elevate Your Hiring Process',
};

export default async function Page() {
  const supabase = await createClient();

  // Obtener usuario y perfil en una sola consulta
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return redirect('/sign-in');
  }

  // Obtener el perfil con el rol desde el servidor
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*, roles(*)')
    .eq('user_id', user.id)
    .single();

  // Si hay error al obtener el perfil, manejar según tu lógica
  if (profileError) {
    console.error('Error fetching profile:', profileError);
    // Puedes redirigir a una página de error o retornar un estado por defecto
    return redirect('/error');
  }

  return <DashboardView role={profile.roles.name} id={user.id} />;
}
