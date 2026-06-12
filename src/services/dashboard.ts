import { createClient } from '@/utils/supabase/server';

export type UserRole = 'Administrator' | 'Officer' | 'Cadet';

export interface UserProfile {
  user_id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  student_id: string;
  rank_id: string;
  status: string;
  rank: {
    title: string;
    abbreviation: string;
    hierarchy_level: number;
  };
}

export interface CadetDashboardData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextEvent: any | null;
  attendanceScore: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentAnnouncements: any[];
}

export interface OfficerDashboardData {
  unitStrength: number;
  overallAttendance: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentAnnouncements: any[];
}

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('personnel_profiles')
    .select(`
      *,
      rank:ranks (
        title,
        abbreviation,
        hierarchy_level
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    console.error('Error fetching profile:', error);
    return null;
  }

  // Cast because Supabase returns an array for the join if it's a 1:many,
  // but we know it's many:1 (a user has one rank)
  return data as unknown as UserProfile;
}

export async function getCadetDashboardData(userId: string): Promise<CadetDashboardData> {
  const supabase = await createClient();

  // 1. Get next scheduled event
  const { data: nextEvent } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(1)
    .single();

  // 2. Calculate attendance score (Present / Total logs) * 100
  const { data: attendanceLogs } = await supabase
    .from('attendance')
    .select('status')
    .eq('user_id', userId);

  let attendanceScore = 100; // Default to 100% if no logs
  if (attendanceLogs && attendanceLogs.length > 0) {
    const presentCount = attendanceLogs.filter(log => log.status === 'Present').length;
    attendanceScore = Math.round((presentCount / attendanceLogs.length) * 100);
  }

  // 3. Get recent announcements
  const { data: recentAnnouncements } = await supabase
    .from('announcements')
    .select(`
      *,
      posted_by_profile:personnel_profiles!posted_by (
        last_name,
        rank:ranks(abbreviation)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(3);

  return {
    nextEvent: nextEvent || null,
    attendanceScore,
    recentAnnouncements: recentAnnouncements || [],
  };
}

export async function getOfficerDashboardData(): Promise<OfficerDashboardData> {
  const supabase = await createClient();

  // 1. Get unit strength (Total Active Personnel)
  const { count: unitStrength } = await supabase
    .from('personnel_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  // 2. Get overall attendance average across the unit
  const { data: allAttendance } = await supabase
    .from('attendance')
    .select('status');

  let overallAttendance = 100;
  if (allAttendance && allAttendance.length > 0) {
    const presentCount = allAttendance.filter(log => log.status === 'Present').length;
    overallAttendance = Math.round((presentCount / allAttendance.length) * 100);
  }

  // 3. Get recent announcements
  const { data: recentAnnouncements } = await supabase
    .from('announcements')
    .select(`
      *,
      posted_by_profile:personnel_profiles!posted_by (
        last_name,
        rank:ranks(abbreviation)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(3);

  return {
    unitStrength: unitStrength || 0,
    overallAttendance,
    recentAnnouncements: recentAnnouncements || [],
  };
}
