import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // KCB Landing Palette
        'kcb-noir': '#0a0a0a',
        'kcb-noir-deep': '#050505',
        'kcb-ardoise': '#1c1c1e',
        'kcb-ardoise-cool': '#16181e',
        'kcb-pierre': '#3a3a3c',
        'kcb-sable': '#d4c5a9',
        'kcb-ivoire': '#f5f0e8',
        'kcb-blanc': '#ffffff',
        'kcb-or': '#c9a84c',
        'kcb-bronze': '#8b6914',
        'kcb-silver': '#a8b0bc',
        'kcb-silver-light': '#c4cad4',
        'kcb-silver-dark': '#6b7280',
        'kcb-steel': '#1a1d24',
        'kcb-platinum': '#d6dae0',

        // Functional colors
        'kcb-succes': '#2D6A4F',
        'kcb-alerte': '#D4A017',
        'kcb-erreur': '#8B1A1A',
        'kcb-info': '#1A3A5C',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        'dm-sans': ['DM Sans', 'system-ui', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
} satisfies Config
