import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'auth-gradient':
          'radial-gradient(circle at 25% 20%, rgba(59,130,246,.35) 0%, transparent 40%), radial-gradient(circle at 80% 0%, rgba(168,85,247,.28) 0%, transparent 35%), linear-gradient(135deg, #0f172a, #111827 55%, #030712)',
      },
    },
  },
  plugins: [],
};

export default config;
