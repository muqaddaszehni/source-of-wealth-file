/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0E1B2E',
        'navy-soft': '#16273D',
        bone: '#F7F4EE',
        paper: '#FCFAF5',
        brass: '#B0904F',
        'brass-deep': '#937736',
        charcoal: '#1C1C1C',
        hairline: '#D8D2C6',
        sage: '#4F6B53',
        ochre: '#9C7B3C',
        slatey: '#8B8579',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.22em',
        wide2: '0.14em',
      },
      boxShadow: {
        document: '0 30px 80px -45px rgba(14,27,46,0.45)',
        rail: '0 1px 0 0 rgba(14,27,46,0.04)',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sweep: {
          '0%': { strokeDashoffset: 'var(--circ)' },
          '100%': { strokeDashoffset: 'var(--target)' },
        },
      },
      animation: {
        reveal: 'reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
