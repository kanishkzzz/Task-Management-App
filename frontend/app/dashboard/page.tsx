'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { logoutUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    toast.success('You have been logged out.');
    router.replace('/login');
  };

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="glass-card w-full max-w-xl rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-semibold">Welcome to your dashboard</h1>
          <p className="mt-3 text-slate-300">
            This route is protected and can only be viewed with a valid token.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 rounded-xl bg-rose-500 px-5 py-2 font-medium text-white transition hover:bg-rose-400"
          >
            Log out
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}
