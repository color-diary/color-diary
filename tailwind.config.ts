import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        mobile: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    },
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)']
      },
      boxShadow: {
        'inner-top-left': 'inset 3px 3px 5px rgba(0, 0, 0, 0.2)',
        'progress-border': '0rem 0rem 0rem 0.1875rem var(--border-color)'
      },
      spacing: {
        '4px-row': 'calc(100vw * 0.00208)',
        '8px-row': 'calc(100vw * 0.00417)',
        '12px-row': 'calc(100vw * 0.00625)',
        '16px-row': 'calc(100vw * 0.00833)',
        '20px-row': 'calc(100vw * 0.01042)',
        '24px-row': 'calc(100vw * 0.01250)',
        '48px-row': 'calc(100vw * 0.025)',
        '72px-row': 'calc(100vw * 0.0375)',
        '200px-row': 'calc(100vw * 0.1042)',
        '420px-row': 'calc(100vw * 0.2230)',
        '600px-row': 'calc(100vw * 0.3125)',
        '744px-row': 'calc(100vw * 0.3875)',
        '4px-col': 'calc(100vh * 0.00370)',
        '8px-col': 'calc(100vh * 0.00741)',
        '12px-col': 'calc(100vh * 0.01111)',
        '16px-col': 'calc(100vh * 0.0148)',
        '20px-col': 'calc(100vh * 0.0185)',
        '24px-col': 'calc(100vh * 0.02222)',
        '32px-col': 'calc(100vh * 0.0296)',
        '36px-col': 'calc(100vh * 0.03333)',
        '40px-col': 'calc(100vh * 0.0370)',
        '44px-col': 'calc(100vh * 0.04074)',
        '52px-col': 'calc(100vh * 0.0481)',
        '56px-col': 'calc(100vh * 0.05185)',
        '64px-col': 'calc(100vh * 0.05926)',
        '72px-col': 'calc(100vh * 0.0667)',
        '80px-col': 'calc(100vh * 0.07407)',
        '200px-col': 'calc(100vh * 0.1852)',
        '240px-col': 'calc(100vh * 0.2222)',
        '760px-col': 'calc(100vh * 0.7037)'
      },
      fontSize: {
        '14px': ['calc((100vw * 0.00729 + 100vh * 0.01296) / 2)', { lineHeight: '1.35' }],
        '16px': ['calc((100vw * 0.00833 + 100vh * 0.01481) / 2)', { lineHeight: '1.35' }],
        '18px': ['calc((100vw * 0.00938 + 100vh * 0.01667) / 2)', { lineHeight: '1.35' }],
        '20px': ['calc((100vw * 0.0104 + 100vh * 0.0185) / 2)', { lineHeight: '1.35' }],
        '24px': ['calc((100vw * 0.0125 + 100vh * 0.02222) / 2)', { lineHeight: '1.35' }],
        '28px': ['calc((100vw * 0.01458 + 100vh * 0.02593) / 2)', { lineHeight: '1.35' }]
      },
      letterSpacing: {
        '0.28px': '-0.0175rem',
        '0.32px': '-0.02rem',
        '0.36px': '-0.0225rem',
        '0.48px': '-0.03rem',
        '0.56px': '-0.035rem'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        default: 'var(--default-color)',
        pressed: 'var(--pressed-color)',
        disable: 'var(--disable-color)',
        'tertiary-default': 'var(--tertiary-color)',
        'tertiary-pressed': 'var(--tertiary-pressed-color)',
        'tertiary-disable': 'var(--tertiary-disable-color)',
        'text-button-disable': 'var( --text-button-disable-color)',
        toast: 'var(--toast-color)',
        'border-color': 'var(--border-color)',
        'bg-color': 'var(--bg-color)',
        layout: 'var(--layout-color)',
        'progress-total-color': 'var(--progress-total-color)',
        'progress-current-color': 'var(--progress-current-color)',
        'progress-border-color': 'var(--progress-border-color)',
        'font-color': 'var(--font-color)',
        'modal-font-color': 'var(--modal-font-color)',
        backdrop: 'rgba(0, 0, 0, 0.30)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '5xl': '2rem'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;

export default config;
