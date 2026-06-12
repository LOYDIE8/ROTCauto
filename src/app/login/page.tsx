'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Renders the authentication portal.
 * Handles user login via Supabase Auth using email and password, utilizing react-hook-form and Zod for validation.
 * Features a minimalist militaristic UI aesthetic.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--dark-grey)] border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
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
            Authentication Protocol
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-950/50 border border-red-500/50 p-4 rounded flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--neon-cyan)] hover:bg-cyan-400 text-black font-mono font-bold uppercase py-3 px-4 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Log In'
            )}
          </button>

          <div className="text-center mt-4">
            <Link href="/register" className="text-xs font-mono text-gray-400 hover:text-[var(--neon-cyan)] transition-colors">
              NO SERVICE RECORD? REGISTER HERE
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
