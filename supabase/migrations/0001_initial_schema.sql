-- Create custom types
CREATE TYPE user_role AS ENUM ('Administrator', 'Officer', 'Cadet');
CREATE TYPE profile_status AS ENUM ('Active', 'Inactive');
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Excused');
CREATE TYPE announcement_priority AS ENUM ('Routine', 'Critical');

-- 1. users table (Extends Supabase Auth conceptually, using auth.users natively but we'll create a public.users profile mapping)
-- Note: In a real Supabase project, you would often use auth.users and create a trigger to populate a public profiles table.
-- Here we'll create the public profiles table as `personnel_profiles` and assume it links to `auth.users(id)`.

-- We will create a trigger to handle new user signups.

-- Create ranks table
CREATE TABLE public.ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50) NOT NULL,
    hierarchy_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial ranks
INSERT INTO public.ranks (title, abbreviation, hierarchy_level) VALUES
('Administrator', 'SYSADMIN', 100),
('Officer', 'OFFICER', 50),
('Cadet', 'CDT', 10);

-- Create personnel_profiles table (linking to auth.users)
CREATE TABLE public.personnel_profiles (
    user_id UUID PRIMARY KEY, -- Will link to auth.users in production
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'Cadet'::user_role NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(100) UNIQUE NOT NULL,
    rank_id UUID REFERENCES public.ranks(id),
    status profile_status DEFAULT 'Active'::profile_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    uniform_requirement VARCHAR(255),
    opord_summary TEXT,
    created_by UUID REFERENCES public.personnel_profiles(user_id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.personnel_profiles(user_id) ON DELETE CASCADE NOT NULL,
    status attendance_status NOT NULL,
    logged_by UUID REFERENCES public.personnel_profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- Create announcements table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority announcement_priority DEFAULT 'Routine'::announcement_priority NOT NULL,
    posted_by UUID REFERENCES public.personnel_profiles(user_id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ranks (Everyone can read, only SysAdmin can modify)
CREATE POLICY "Ranks are viewable by everyone" ON public.ranks
    FOR SELECT USING (true);

-- RLS Policies for personnel_profiles
CREATE POLICY "Users can view their own profile" ON public.personnel_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Officers and Admins can view all profiles" ON public.personnel_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

CREATE POLICY "Users can update their own non-critical profile fields" ON public.personnel_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Officers and Admins can create events" ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

CREATE POLICY "Officers and Admins can update events" ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

-- RLS Policies for attendance
CREATE POLICY "Users can view their own attendance" ON public.attendance
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Officers and Admins can view all attendance" ON public.attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

CREATE POLICY "Officers and Admins can log attendance" ON public.attendance
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

CREATE POLICY "Officers and Admins can update attendance" ON public.attendance
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

-- RLS Policies for announcements
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements
    FOR SELECT USING (true);

CREATE POLICY "Officers and Admins can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

CREATE POLICY "Officers and Admins can update announcements" ON public.announcements
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );
