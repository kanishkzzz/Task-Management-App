interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="glass-card w-full max-w-md rounded-2xl p-8">
        <h1 className="text-center text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-center text-sm text-slate-300">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
