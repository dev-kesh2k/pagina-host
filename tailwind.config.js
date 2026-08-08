/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-cyan-500/15', 'text-cyan-300', 'shadow-cyan-500/10', 'text-cyan-300/80', 'border-cyan-400/20', 'text-cyan-200', 'hover:border-cyan-400/40', 'bg-cyan-500/20', 'ring-cyan-400/30',
    'bg-violet-500/15', 'text-violet-300', 'shadow-violet-500/10', 'text-violet-300/80', 'border-violet-400/20', 'text-violet-200', 'hover:border-violet-400/40', 'bg-violet-500/20', 'ring-violet-400/30',
    'bg-amber-500/15', 'text-amber-300', 'shadow-amber-500/10', 'text-amber-300/80', 'border-amber-400/20', 'text-amber-200', 'hover:border-amber-400/40', 'bg-amber-500/20', 'ring-amber-400/30',
    'bg-sky-500/15', 'text-sky-300', 'shadow-sky-500/10', 'text-sky-300/80', 'border-sky-400/20', 'text-sky-200', 'hover:border-sky-400/40', 'bg-sky-500/20', 'ring-sky-400/30',
    'bg-emerald-500/15', 'text-emerald-300', 'shadow-emerald-500/10', 'text-emerald-300/80', 'border-emerald-400/20', 'text-emerald-200', 'hover:border-emerald-400/40', 'bg-emerald-500/20', 'ring-emerald-400/30',
    'bg-rose-500/15', 'text-rose-300', 'shadow-rose-500/10', 'text-rose-300/80', 'border-rose-400/20', 'text-rose-200', 'hover:border-rose-400/40', 'bg-rose-500/20', 'ring-rose-400/30',
    'bg-indigo-500/15', 'text-indigo-300', 'shadow-indigo-500/10', 'text-indigo-300/80', 'border-indigo-400/20', 'text-indigo-200', 'hover:border-indigo-400/40', 'bg-indigo-500/20', 'ring-indigo-400/30',
    'bg-fuchsia-500/15', 'text-fuchsia-300', 'shadow-fuchsia-500/10', 'text-fuchsia-300/80', 'border-fuchsia-400/20', 'text-fuchsia-200', 'hover:border-fuchsia-400/40', 'bg-fuchsia-500/20', 'ring-fuchsia-400/30',
  ],
}
