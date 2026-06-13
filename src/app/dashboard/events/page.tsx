import React from 'react';
import EventCalendar from './components/EventCalendar';
import CreateEventModal from './components/CreateEventModal';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-mono text-[var(--neon-cyan)] uppercase">Operational Calendar</h1>
          <p className="text-sm font-mono text-gray-500 uppercase mt-1">
            Schedule formations, tactical drills, and examinations.
          </p>
        </div>
        <CreateEventModal />
      </div>

      <div className="bg-[var(--dark-grey)] border border-gray-800 p-6 min-h-[500px]">
        <EventCalendar />
      </div>
    </div>
  );
}
