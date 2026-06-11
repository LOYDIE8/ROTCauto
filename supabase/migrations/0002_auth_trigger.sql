-- Create a trigger to automatically create a personnel_profiles record when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_cadet_rank_id UUID;
BEGIN
  -- Get the ID of the 'Cadet' rank
  SELECT id INTO v_cadet_rank_id FROM public.ranks WHERE abbreviation = 'CDT' LIMIT 1;

  -- Insert into public.personnel_profiles
  INSERT INTO public.personnel_profiles (
    user_id,
    email,
    role,
    first_name,
    last_name,
    student_id,
    rank_id,
    status
  )
  VALUES (
    new.id,
    new.email,
    'Cadet'::user_role,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'student_id',
    v_cadet_rank_id,
    'Active'::profile_status
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
