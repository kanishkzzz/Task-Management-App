import { LucideIcon } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

export function TextInput({ icon: Icon, ...props }: TextInputProps) {
  return (
    <label className="relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-white/20 bg-black/20 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 outline-none ring-indigo-400 transition focus:ring-2"
      />
    </label>
  );
}
