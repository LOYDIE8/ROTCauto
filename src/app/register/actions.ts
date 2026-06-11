'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

type RegisterFormData = {
  firstName: string;
  lastName: string;
  dob: string;
  studentId: string;
  email: string;
  phone: string;
  program: string;
  password: string;
}

export async function registerUser(formData: RegisterFormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        dob: formData.dob,
        student_id: formData.studentId,
        phone: formData.phone,
        program: formData.program,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
