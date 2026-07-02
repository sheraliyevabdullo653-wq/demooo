/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        glass: {
          light: 'rgba(255,255,255,0.08)',
          dark: 'rgba(0,0,0,0.08)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-light': 'radial-gradient(at 40% 20%, hsla(174,73%,89%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,90%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(262,100%,95%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(174,69%,87%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(189,100%,90%,1) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, hsla(174,73%,15%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,10%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(262,100%,10%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(174,69%,12%,1) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
