-- Create custom type for feedback categories
CREATE TYPE feedback_category AS ENUM ('Hotfix', 'UI_UX_Optimization', 'Feature_Request', 'System_Error');

-- Create feedback_reports table
CREATE TABLE public.feedback_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.personnel_profiles(user_id) ON DELETE SET NULL, -- Nullable to catch unauthenticated system errors
    category feedback_category NOT NULL,
    description TEXT NOT NULL,
    route_context VARCHAR(255),
    browser_info TEXT,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback_reports
-- Any authenticated user can submit feedback
CREATE POLICY "Users can insert their own feedback" ON public.feedback_reports
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR user_id IS NULL
    );

-- Only users can see their own feedback, unless they are an Officer/Admin
CREATE POLICY "Users can view their own feedback" ON public.feedback_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Officers and Admins can view all feedback" ON public.feedback_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );

CREATE POLICY "Officers and Admins can update feedback status" ON public.feedback_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.personnel_profiles
            WHERE user_id = auth.uid() AND role IN ('Administrator', 'Officer')
        )
    );
