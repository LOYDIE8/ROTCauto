'use client';

import { createClient } from '@/utils/supabase/client';
import { LogOut, LayoutDashboard, Users, Calendar, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

/**
 * The global layout wrapper for all authenticated dashboard routes.
 * Implements the tactical, militaristic UI theme, sidebar navigation, and session termination logic.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The nested page content to render.
 * @returns {JSX.Element} The rendered dashboard layout structure.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Personnel', href: '/dashboard/personnel', icon: Users },
    { name: 'Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[var(--dark-grey)] border-r border-gray-800 flex flex-col relative">
        {/* Tactical grid overlay for sidebar */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="p-6 border-b border-gray-800 z-10">
          <h1 className="text-xl font-mono tracking-widest text-[var(--neon-cyan)] uppercase">
            NavalCommand
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase">Terminal Active</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm uppercase transition-all duration-200 border-l-2 ${
                  isActive
                    ? 'border-[var(--neon-cyan)] bg-black/50 text-[var(--neon-cyan)]'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:bg-gray-900/50 hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 z-10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 font-mono text-sm uppercase text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top border accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-50"></div>
        <div className="p-8 relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
