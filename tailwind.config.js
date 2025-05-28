/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Gradient backgrounds
    'bg-gradient-to-b',
    'bg-gradient-to-r',
    'from-slate-900',
    'via-purple-900',
    'to-slate-900',
    'from-purple-600',
    'to-blue-600',
    'from-purple-500',
    'to-blue-500',
    'from-purple-400',
    'via-pink-400',
    'to-blue-400',
    // Background colors with opacity
    'bg-white/5',
    'bg-white/10',
    'bg-purple-500',
    'bg-blue-500',
    // Border colors with opacity
    'border-white/10',
    'border-purple-400/30',
    'border-purple-400/50',
    'border-purple-400/60',
    // Text colors
    'text-white',
    'text-gray-300',
    'text-gray-400',
    'text-yellow-300',
    'text-yellow-400',
    'text-purple-400',
    // Backdrop blur
    'backdrop-blur-sm',
    'backdrop-blur-lg',
    // Complex positioning
    'left-[10%]',
    'top-[20%]',
    'right-[15%]',
    'bottom-[20%]',
    // Blur effects
    'blur-3xl',
    // Shadow effects
    'hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.5)]',
    'hover:shadow-2xl',
    'hover:shadow-purple-500/50',
    // Gradient text
    'bg-clip-text',
    'text-transparent',
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}

