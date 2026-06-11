-- Fix infinite recursion in RLS policies by using a security definer function to check roles

-- Create a helper function to get the current user's role securely
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS public.user_role AS $$
DECLARE
    found_role public.user_role;
BEGIN
    SELECT role INTO found_role
    FROM public.personnel_profiles
    WHERE user_id = check_user_id;

    RETURN found_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old recursive policies for personnel_profiles
DROP POLICY IF EXISTS "Officers and Admins can view all profiles" ON public.personnel_profiles;

-- Create new policies using the helper function
CREATE POLICY "Officers and Admins can view all profiles" ON public.personnel_profiles
    FOR SELECT USING (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

-- Drop old recursive policies for events
DROP POLICY IF EXISTS "Officers and Admins can create events" ON public.events;
DROP POLICY IF EXISTS "Officers and Admins can update events" ON public.events;

-- Create new policies for events
CREATE POLICY "Officers and Admins can create events" ON public.events
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

CREATE POLICY "Officers and Admins can update events" ON public.events
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

-- Drop old recursive policies for attendance
DROP POLICY IF EXISTS "Officers and Admins can view all attendance" ON public.attendance;
DROP POLICY IF EXISTS "Officers and Admins can log attendance" ON public.attendance;
DROP POLICY IF EXISTS "Officers and Admins can update attendance" ON public.attendance;

-- Create new policies for attendance
CREATE POLICY "Officers and Admins can view all attendance" ON public.attendance
    FOR SELECT USING (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

CREATE POLICY "Officers and Admins can log attendance" ON public.attendance
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

CREATE POLICY "Officers and Admins can update attendance" ON public.attendance
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

-- Drop old recursive policies for announcements
DROP POLICY IF EXISTS "Officers and Admins can create announcements" ON public.announcements;
DROP POLICY IF EXISTS "Officers and Admins can update announcements" ON public.announcements;

-- Create new policies for announcements
CREATE POLICY "Officers and Admins can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );

CREATE POLICY "Officers and Admins can update announcements" ON public.announcements
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) IN ('Administrator', 'Officer')
    );
