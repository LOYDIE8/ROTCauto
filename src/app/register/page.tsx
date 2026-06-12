'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Password complexity regex: at least 8 chars, one letter, one number, one special char
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dob: z.string().min(1, 'Date of Birth is required'),
  studentId: z.string().min(4, 'Student ID is required'),
  email: z.string().email('Invalid email address'),
  contactNumber: z.string().min(7, 'Contact number is required'),
  academicProgram: z.string().min(2, 'Academic program is required'),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must be at least 8 chars, contain a letter, a number, and a special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            dob: data.dob,
            student_id: data.studentId,
            contact_number: data.contactNumber,
            academic_program: data.academicProgram,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[var(--dark-grey)] border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
        {/* Tactical corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-cyan)]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-cyan)]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)]"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono tracking-widest text-[var(--neon-cyan)] uppercase">
            NavalCommand
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-2 uppercase tracking-wide">
            Personnel Registration Protocol
          </p>
        </div>

        {success ? (
          <div className="bg-green-900/20 border border-green-500/50 p-6 rounded text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-mono text-green-400 mb-2">Registration Submitted</h2>
            <p className="text-gray-300">
              Your service record has been created. Please check your email ({' '}
              <span className="text-[var(--neon-cyan)]">pending verification</span> ) to complete
              the induction process.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-950/50 border border-red-500/50 p-4 rounded flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">First Name</label>
                <input
                  {...register('firstName')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                  placeholder="JOHN"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs font-mono">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Last Name</label>
                <input
                  {...register('lastName')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                  placeholder="DOE"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs font-mono">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Student ID</label>
                <input
                  {...register('studentId')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                  placeholder="0000-0000"
                />
                {errors.studentId && (
                  <p className="text-red-400 text-xs font-mono">{errors.studentId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Date of Birth</label>
                <input
                  type="date"
                  {...register('dob')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                />
                {errors.dob && (
                  <p className="text-red-400 text-xs font-mono">{errors.dob.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                  placeholder="cadet@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs font-mono">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Contact Number</label>
                <input
                  {...register('contactNumber')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.contactNumber && (
                  <p className="text-red-400 text-xs font-mono">{errors.contactNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Academic Program</label>
                <input
                  {...register('academicProgram')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                  placeholder="BSIT"
                />
                {errors.academicProgram && (
                  <p className="text-red-400 text-xs font-mono">{errors.academicProgram.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs font-mono">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full bg-black/50 border border-gray-700 px-4 py-2 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs font-mono">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--neon-cyan)] hover:bg-cyan-400 text-black font-mono font-bold uppercase py-3 px-4 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Registration'
              )}
            </button>

            <div className="text-center mt-4">
              <Link href="/login" className="text-xs font-mono text-gray-400 hover:text-[var(--neon-cyan)] transition-colors">
                ALREADY HAVE A SERVICE RECORD? LOG IN
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
