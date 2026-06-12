import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { UserProfile, CadetDashboardData } from '@/services/dashboard';

/**
 * Renders the dashboard view specifically tailored for Cadets.
 * Displays personal metrics including current rank, upcoming formations, and personal attendance.
 *
 * @param {Object} props - The component props.
 * @param {UserProfile} props.profile - The authenticated Cadet's profile data.
 * @param {CadetDashboardData} props.data - The metrics and data specific to the Cadet.
 * @returns {JSX.Element} The rendered Cadet dashboard view.
 */
export default function CadetView({
  profile,
  data,
}: {
  profile: UserProfile;
  data: CadetDashboardData;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-[var(--dark-grey)] border border-gray-800 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--neon-cyan)] opacity-10 rounded-bl-full"></div>
          <h2 className="text-xs font-mono text-gray-500 uppercase mb-1">Personnel Record</h2>
          <p className="text-2xl font-mono text-[var(--neon-cyan)] uppercase">
            {profile.rank.abbreviation} {profile.last_name}
          </p>
          <p className="text-sm font-mono text-gray-400 mt-2">ID: {profile.student_id}</p>
          <div className="mt-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--neon-cyan)]" />
            <span className="text-xs font-mono uppercase text-[var(--neon-cyan)]">{profile.status}</span>
          </div>
        </div>

        {/* Next Event Card */}
        <div className="bg-[var(--dark-grey)] border border-gray-800 p-6 relative">
          <h2 className="text-xs font-mono text-gray-500 uppercase mb-4">Next Formation</h2>
          {data.nextEvent ? (
            <>
              <p className="text-lg font-mono text-white uppercase">{data.nextEvent.title}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-mono text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(data.nextEvent.event_date).toLocaleString()}
                </p>
                <p className="text-sm font-mono text-gray-400 uppercase">
                  LOC: {data.nextEvent.location}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm font-mono text-gray-500 uppercase">No upcoming events scheduled.</p>
          )}
        </div>

        {/* Attendance Score Card */}
        <div className="bg-[var(--dark-grey)] border border-gray-800 p-6 flex flex-col justify-center items-center relative">
           <h2 className="absolute top-6 left-6 text-xs font-mono text-gray-500 uppercase">Attendance Score</h2>
           <div className="text-5xl font-mono mt-4">
             <span className={data.attendanceScore >= 80 ? 'text-green-400' : 'text-red-400'}>
                {data.attendanceScore}%
             </span>
           </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-[var(--dark-grey)] border border-gray-800 p-6">
        <h2 className="text-xs font-mono text-[var(--neon-cyan)] uppercase mb-6 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Command Board
        </h2>

        {data.recentAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {data.recentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`p-4 border-l-2 bg-black/30 ${
                  announcement.priority === 'Critical'
                    ? 'border-[var(--neon-cyan)]'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-white uppercase">{announcement.title}</h3>
                  <span className="text-xs font-mono text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{announcement.content}</p>
                <p className="text-xs font-mono text-gray-500 mt-2 uppercase">
                  {`// AUTH: ${announcement.posted_by_profile.rank.abbreviation} ${announcement.posted_by_profile.last_name}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-mono text-gray-500 uppercase">No active announcements.</p>
        )}
      </div>
    </div>
  );
}
