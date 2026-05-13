import type { Config } from 'tailwindcss'

const config: Partial<Config> = {
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
      },
      borderRadius: {
        box: '1rem',
        control: '0.625rem',
        media: '0.875rem',
      },
      colors: {
        canvas: '#070B14',
        panel: '#0F1A2E',
        'panel-soft': '#13213B',
        stroke: '#213454',
        'brand-violet': '#C464FF',
        'brand-blue': '#1867ED',
        'brand-cyan': '#1DB6FD',
        'brand-cyan-light': '#9DE6FF',
        copy: {
          strong: '#F2F7FF',
          base: '#CAD7EA',
          muted: '#9EB1CD',
        },
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(29, 182, 253, 0.38), 0 14px 38px rgba(24, 103, 237, 0.3)',
      },
      backgroundImage: {
        mesh: [
          'radial-gradient(circle at 16% 10%, rgba(196, 100, 255, 0.2), transparent 34%)',
          'radial-gradient(circle at 84% 6%, rgba(29, 182, 253, 0.18), transparent 36%)',
          'radial-gradient(circle at 50% 88%, rgba(24, 103, 237, 0.16), transparent 44%)',
        ].join(','),
        ribbon:
          'linear-gradient(125deg, rgba(196, 100, 255, 0.2), rgba(18, 31, 56, 0.2) 38%, rgba(29, 182, 253, 0.2))',
        'brand-gradient': 'linear-gradient(130deg, #C464FF 0%, #3F6EFF 45%, #1DB6FD 100%)',
        noise: 'linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02))',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translate3d(0, 14px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite',
        'fade-up': 'fadeUp 680ms ease-out both',
      },
    },
  },
}

export default config
