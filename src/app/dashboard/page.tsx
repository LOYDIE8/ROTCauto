export const dynamic = 'force-dynamic';
import { getProfile, getCadetDashboardData, getOfficerDashboardData } from '@/services/dashboard';
import CadetView from './components/CadetView';
import OfficerView from './components/OfficerView';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  if (profile.role === 'Cadet') {
    const data = await getCadetDashboardData(profile.user_id);
    return <CadetView profile={profile} data={data} />;
  }

  if (profile.role === 'Officer' || profile.role === 'Administrator') {
    const data = await getOfficerDashboardData();
    return <OfficerView profile={profile} data={data} />;
  }

  // Fallback if role is unhandled
  return (
    <div className="p-8 text-red-500 font-mono">
      Error: Unrecognized role protocol.
    </div>
  );
}
