import { getProfile, getCadetDashboardData, getOfficerDashboardData } from '../dashboard';
import { createClient } from '@/utils/supabase/server';

// Mock the dependencies
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('Dashboard Service Layer', () => {
  let mockSupabase: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // The functions chain:
    // .select().eq()  -- select needs to return an object that HAS eq
    // .eq() itself resolves
    // Since mockQueryBuilder.select() was returning mockQueryBuilder, and mockQueryBuilder HAS eq, it should have worked...
    // Let's redefine the mock to explicitly return a resolved promise for the final step.

    // We'll create a factory function to always return a new chainable object that resolves directly if awaited
    const createChain = () => {
      const chain: any = {};
      chain.select = jest.fn().mockReturnValue(chain);
      chain.eq = jest.fn().mockReturnValue(chain);
      chain.gte = jest.fn().mockReturnValue(chain);
      chain.order = jest.fn().mockReturnValue(chain);
      chain.limit = jest.fn().mockReturnValue(chain);
      chain.single = jest.fn().mockReturnValue(chain);
      // To allow `await chain` to work, the chain needs a then() method
      chain.then = jest.fn((resolve) => resolve({ data: [], error: null }));
      return chain;
    };

    mockQueryBuilder = createChain();

    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe('getProfile()', () => {
    it('returns null if no user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const profile = await getProfile();
      expect(profile).toBeNull();
    });

    it('returns null on database error', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user123' } } });
      mockQueryBuilder.single.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

      const profile = await getProfile();
      expect(profile).toBeNull();
    });

    it('returns user profile successfully', async () => {
      const mockUserData = { id: 'user123' };
      const mockProfileData = {
        user_id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Cadet',
        rank: { abbreviation: 'CDT' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUserData } });
      mockQueryBuilder.single.mockResolvedValue({ data: mockProfileData, error: null });

      const profile = await getProfile();
      expect(profile).toEqual(mockProfileData);
      expect(mockSupabase.from).toHaveBeenCalledWith('personnel_profiles');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123');
    });
  });

  describe('getCadetDashboardData()', () => {
    it('handles empty states safely and calculates 100% attendance by default', async () => {
      // Mock empty events
      mockQueryBuilder.limit.mockResolvedValueOnce({ data: [], error: null });
      // Mock empty attendance
      mockQueryBuilder.eq.mockResolvedValueOnce({ data: [], error: null });
      // Mock empty announcements
      mockQueryBuilder.limit.mockResolvedValueOnce({ data: [], error: null });

      const result = await getCadetDashboardData('user123');

      expect(result.nextEvent).toBeNull();
      expect(result.attendanceScore).toBe(100);
      expect(result.recentAnnouncements).toEqual([]);
    });

    it('calculates attendance correctly', async () => {
      mockQueryBuilder.limit.mockResolvedValueOnce({ data: [{ title: 'Drill' }], error: null });

      // 3 Present, 1 Absent = 75%
      const attendanceLogs = [
        { status: 'Present' }, { status: 'Present' }, { status: 'Present' }, { status: 'Absent' }
      ];
      mockQueryBuilder.eq.mockResolvedValueOnce({ data: attendanceLogs, error: null });

      mockQueryBuilder.limit.mockResolvedValueOnce({ data: [{ title: 'Announce' }], error: null });

      const result = await getCadetDashboardData('user123');

      expect(result.nextEvent).toEqual({ title: 'Drill' });
      expect(result.attendanceScore).toBe(75);
      expect(result.recentAnnouncements).toHaveLength(1);
    });

    it('handles errors gracefully via try/catch fallback', async () => {
      mockQueryBuilder.limit.mockRejectedValue(new Error('Network failure'));

      const result = await getCadetDashboardData('user123');

      expect(result.nextEvent).toBeNull();
      expect(result.attendanceScore).toBe(100);
      expect(result.recentAnnouncements).toEqual([]);
    });
  });

  describe('getOfficerDashboardData()', () => {
    it('handles successful metric calculations', async () => {
      // When calling supabase.from('table') it returns a chain.
      // We will mock `from` directly to return specific chains depending on the table.
      const strengthChain = { select: () => ({ eq: () => Promise.resolve({ count: 42, error: null }) }) };

      const allLogs = [
        { status: 'Present' }, { status: 'Present' }, { status: 'Absent' }, { status: 'Excused' }
      ];
      const attendanceChain = { select: () => Promise.resolve({ data: allLogs, error: null }) };

      const announcementChain = { select: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'personnel_profiles') return strengthChain;
        if (table === 'attendance') return attendanceChain;
        if (table === 'announcements') return announcementChain;
      });

      const result = await getOfficerDashboardData();

      expect(result.unitStrength).toBe(42);
      expect(result.overallAttendance).toBe(50);
      expect(result.recentAnnouncements).toEqual([]);
    });

    it('handles missing count or empty attendance gracefully', async () => {
      const strengthChain = { select: () => ({ eq: () => Promise.resolve({ count: null, error: { message: 'error' } }) }) };
      const attendanceChain = { select: () => Promise.resolve({ data: [], error: null }) };
      const announcementChain = { select: () => ({ order: () => ({ limit: () => Promise.resolve({ data: null, error: { message: 'error' } }) }) }) };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'personnel_profiles') return strengthChain;
        if (table === 'attendance') return attendanceChain;
        if (table === 'announcements') return announcementChain;
      });

      const result = await getOfficerDashboardData();

      expect(result.unitStrength).toBe(0);
      expect(result.overallAttendance).toBe(100);
      expect(result.recentAnnouncements).toEqual([]);
    });
  });
});
