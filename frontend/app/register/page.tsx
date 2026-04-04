'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/auth-shell';
import { TextInput } from '@/components/common/text-input';
import { registerUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await registerUser({ name, email, password });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch {
      toast.error('Could not create account. Try again with valid details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Get started and organize your tasks today"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput
          icon={User}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <TextInput
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextInput
          icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="font-medium text-indigo-300 hover:text-indigo-200" href="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
