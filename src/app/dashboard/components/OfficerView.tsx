import { Users, Crosshair, FileText, AlertTriangle } from 'lucide-react';
import { UserProfile, OfficerDashboardData } from '@/services/dashboard';

export default function OfficerView({
  profile,
  data,
}: {
  profile: UserProfile;
  data: OfficerDashboardData;
}) {
  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-mono text-[var(--neon-cyan)] uppercase">Command Overview</h1>
          <p className="text-sm font-mono text-gray-500 uppercase mt-1">
            Logged in as: {profile.rank.abbreviation} {profile.last_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--dark-grey)] border border-gray-800 p-6 flex flex-col justify-center items-center relative">
            <Users className="absolute top-4 right-4 w-5 h-5 text-gray-600" />
            <h2 className="text-xs font-mono text-gray-500 uppercase mb-2">Unit Strength</h2>
            <p className="text-4xl font-mono text-white">{data.unitStrength}</p>
          </div>

          <div className="bg-[var(--dark-grey)] border border-gray-800 p-6 flex flex-col justify-center items-center relative">
            <Crosshair className="absolute top-4 right-4 w-5 h-5 text-gray-600" />
            <h2 className="text-xs font-mono text-gray-500 uppercase mb-2">Unit Readiness (Att.)</h2>
            <p className="text-4xl font-mono text-[var(--neon-cyan)]">{data.overallAttendance}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--dark-grey)] border border-gray-800 p-6">
          <h2 className="text-xs font-mono text-gray-500 uppercase mb-4">Command Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-black/50 border border-gray-700 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-colors text-gray-400 font-mono text-xs uppercase gap-2">
              <FileText className="w-5 h-5" />
              Log Attendance
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-black/50 border border-gray-700 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-colors text-gray-400 font-mono text-xs uppercase gap-2">
              <AlertTriangle className="w-5 h-5" />
              Post Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-[var(--dark-grey)] border border-gray-800 p-6">
        <h2 className="text-xs font-mono text-[var(--neon-cyan)] uppercase mb-6 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Recent Dispatches
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
