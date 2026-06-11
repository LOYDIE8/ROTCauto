-- Create a trigger to automatically populate public.personnel_profiles upon Supabase Auth signup

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_rank_id UUID;
BEGIN
    -- Get the Cadet rank ID
    SELECT id INTO default_rank_id FROM public.ranks WHERE abbreviation = 'CDT' LIMIT 1;

    INSERT INTO public.personnel_profiles (
        user_id,
        email,
        first_name,
        last_name,
        student_id,
        rank_id,
        role,
        status
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'first_name', 'Unknown'),
        COALESCE(new.raw_user_meta_data->>'last_name', 'Unknown'),
        COALESCE(new.raw_user_meta_data->>'student_id', 'TBD-' || substr(md5(random()::text), 1, 6)),
        default_rank_id,
        'Cadet',
        'Active'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
