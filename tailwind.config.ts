import type { Config } from 'tailwindcss';

interface AddUtilities {
  (
    utilities: Record<string, any>,
    options?: { variants?: string[]; respectPrefix?: boolean; respectImportant?: boolean }
  ): void;
}

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
        'inner-top-left': '0.25rem 0.25rem 0rem 0rem var(--border-color) inset',
        'progress-border': '0rem 0rem 0rem 0.1875rem var(--border-color)',
        'header-shadow': '0px 4px 4px 0px rgba(230, 211, 188, 0.25)'
      },
      spacing: {
        '2.5': '0.625rem',
        '18': '4.5rem',
        '25': '6.25rem',
        '30': '7.5rem',
        '43.5': '10.875rem',
        '110': '27.5rem',
        '190': '47.5rem',
        '4px-row': 'calc(100vw * 0.00208)',
        '8px-row': 'calc(100vw * 0.00417)',
        '12px-row': 'calc(100vw * 0.00625)',
        '13.5px-row': 'calc(100vw * 0.0070)',
        '16px-row': 'calc(100vw * 0.00833)',
        '19.5px-row': 'calc(100vw * 0.0102)',
        '20px-row': 'calc(100vw * 0.01042)',
        '24px-row': 'calc(100vw * 0.01250)',
        '32px-row': 'calc(100vw * 0.01667)',
        '43px-row': 'calc(100vw * 0.0224)',
        '44px-row': 'calc(100vw * 0.02292)',
        '46px-row': 'calc(100vw * 0.023958333)',
        '36px-row': 'calc(100vw * 0.01870)',
        '48px-row': 'calc(100vw * 0.025)',
        '68px-row': 'calc(100vw * 0.03536)',
        '70px-row': 'calc(100vw * 0.036458333)',
        '60px-row': 'calc(100vw * 0.0313)',
        '72px-row': 'calc(100vw * 0.0375)',
        '77px-row': 'calc((77 / 1920) * 100vw)',
        '90px-row': 'calc(100vw * 0.046875)',
        '96px-row': 'calc(100vw * 0.05)',
        '120px-row': 'calc(120 / 1920 * 100vw)',
        '128px-row': 'calc(100vw * 0.0667)',
        '160px-row': 'calc(100vw * 0.0833)',
        '176px-row': 'calc(100vw * 0.0917)',
        '168px-row': 'calc(100vw * 0.08736)',
        '192px-row': 'calc(100vw * 0.1)',
        '195px-row': 'calc(100vw * 0.1015625)',
        '200px-row': 'calc(100vw * 0.1042)',
        '230px-row': 'calc(100vw * 0.11963)',
        '240px-row': 'calc(100vw * 0.125)',
        '250px-row': 'calc(100vw * 0.13025)',
        '282px-row': 'calc(100vw * 0.1469)',
        '310px-row': 'calc(100vw * 0.1615)',
        '320px-row': 'calc(100vw * 0.1664)',
        '335px-row': 'calc(100vw * (335 / 1920))',
        '360px-row': 'calc(100vw * 0.1875)',
        '394px-row': 'calc(100vw * 0.205208)',
        '420px-row': 'calc(100vw * 0.2230)',
        '422px-row': 'calc(100vw * 0.2198)',
        '430px-row': 'calc(100vw * 0.223958)',
        '450px-row': 'calc(100vw * 0.2344)',
        '480px-row': 'calc(100vw * 0.25)',
        '540px-row': 'calc(100vw * 0.28125)',
        '552px-row': 'calc(552 / 1920 * 100vw)',
        '550px-row': 'calc(100vw * 0.2865)',
        '600px-row': 'calc(100vw * 0.3125)',
        '720px-row': 'calc(100vw * 0.375)',
        '744px-row': 'calc(100vw * 0.3875)',
        '939px-row': 'calc(100vw * 0.4891)',
        '1128px-row': 'calc(100vw * 0.5875)',
        '4px-col': 'calc(100vh * 0.00370)',
        '6.5px-col': 'calc(100vh * 0.0060)',
        '8px-col': 'calc(100vh * 0.00741)',
        '12px-col': 'calc(100vh * 0.01111)',
        '16px-col': 'calc(100vh * 0.0148)',
        '20px-col': 'calc(100vh * 0.0185)',
        '24px-col': 'calc(100vh * 0.02222)',
        '27px-col': 'calc(100vh * 0.0250)',
        '30px-col': 'calc(100vh * 0.0278)',
        '32px-col': 'calc(100vh * 0.02963)',
        '34px-col': 'calc(100vh * 0.0315)',
        '36px-col': 'calc(100vh * 0.03333)',
        '40px-col': 'calc(100vh * 0.0370)',
        '44px-col': 'calc(100vh * 0.04074)',
        '46px-col': 'calc(100vh * 0.04259)',
        '48px-col': 'calc(100vh * 0.04444)',
        '52px-col': 'calc(100vh * 0.0481)',
        '56px-col': 'calc(100vh * 0.05185)',
        '64px-col': 'calc(100vh * 0.05926)',
        '72px-col': 'calc(100vh * 0.0667)',
        '74px-col': 'calc(100vh * 0.06852)',
        '76px-col': 'calc(100vh * 0.07037)',
        '80px-col': 'calc(100vh * 0.07407)',
        '102px-col': 'calc(100vh * 0.09453)',
        '105px-col': 'calc(100vh * 0.0972)',
        '112px-col': 'calc(100vh * 0.1037)',
        '120px-col': 'calc(100vh * 0.11115)',
        '128px-col': 'calc(100vh * 0.1185)',
        '150px-col': 'calc(100vh * 0.1389)',
        '160px-col': 'calc(100vh * 0.1481)',
        '176px-col': 'calc(100vh * 0.16296)',
        '192px-col': 'calc(100vh * 0.1778)',
        '195px-col': 'calc(100vh * 0.1015625)',
        '200px-col': 'calc(100vh * 0.1852)',
        '240px-col': 'calc(100vh * 0.2222)',
        '300px-col': 'calc(100vh * 0.2778)',
        '304px-col': 'calc(100vh * 0.2815)',
        '307px-col': 'calc(100vh * 0.2843)',
        '354px-col': 'calc(100vh * 0.3278)',
        '361px-col': 'calc(100vh * 0.3343)',
        '401px-col': 'calc(100vh * 0.3713)',
        '560px-col': 'calc(100vh * 0.5185)',
        '644px-col': 'calc(100vh * 0.5963)',
        '760px-col': 'calc(100vh * 0.7037)',
        '818px-col': 'calc(100vh * 0.75741)',
        '859px-col': 'calc(100vh * 0.79537)',
        '4px-row-m': 'calc(100vw * 0.01067)',
        '6px-row-m': 'calc(100vw * 0.01600)',
        '8px-row-m': 'calc(100vw * 0.02133)',
        '12px-row-m': 'calc(100vw * 0.032)',
        '16px-row-m': 'calc(100vw * 0.04267)',
        '20px-row-m': 'calc(100vw * 0.05333)',
        '24px-row-m': 'calc(100vw * 0.064)',
        '32px-row-m': 'calc(100vw * 0.08533)',
        '48px-row-m': 'calc(100vw * 0.128)',
        '64px-row-m': 'calc(100vw * 0.1707)',
        '70px-row-m': 'calc(100vw * 0.1867)',
        '68px-row-m': 'calc(100vw * (68 / 375))',
        '78px-row-m': 'calc(100vw * (78 / 375))',
        '80px-row-m': 'calc((80 / 375) * 100vw)',
        '102px-row-m': 'calc(100vw * 0.272)',
        '196px-row-m': 'calc(100vw * 0.5227)',
        '120px-row-m': 'calc(100vw * 0.32)',
        '200px-row-m': 'calc(100vw * 0.533)',
        '252px-row-m': 'calc((252 / 375) * 100vw)',
        '287px-row-m': 'calc((287 / 375) * 100vw)',
        '300px-row-m': 'calc(100vw * 0.8)',
        '335px-row-m': 'calc(100vw * 0.89333)',
        '360px-row-m': 'calc((360 / 375) * 100vw)',
        '480px-row-m': 'calc((480 / 375) * 100vw)',
        '4px-col-m': 'calc(100vh * 0.00599)',
        '5px-col-m': 'calc(100vh * 0.0075)',
        '8px-col-m': 'calc(100vh * 0.012)',
        '10px-col-m': 'calc(100vh * 0.015)',
        '12px-col-m': 'calc(100vh * 0.01772)',
        '16px-col-m': 'calc(100vh * 0.02399)',
        '20px-col-m': 'calc( 100vh * 0.02999)',
        '24px-col-m': 'calc(100vh * 0.036)',
        '28px-col-m': 'calc(100vh * 0.0345)',
        '32px-col-m': 'calc(100vh * 0.048)',
        '35px-col-m': 'calc((35 / 375) * 100vw)',
        '36px-col-m': 'calc(100vh * 0.054)',
        '40px-col-m': 'calc(100vh * 0.06)',
        '56px-col-m': 'calc(100vh * 0.08396)',
        '64px-col-m': 'calc(100vh * 0.096)',
        '80px-col-m': 'calc(100vh * 0.11999)',
        '102px-col-m': 'calc(100vh * 0.153)',
        '135px-col-m': 'calc((135 / 375) * 100vw)',
        '140px-col-m': 'calc((140 / 375) * 100vw)',
        '192px-col-m': 'calc((192 / 375) * 100vw)',
        '200px-col-m': 'calc(100vh * 0.2463)',
        '264px-col-m': 'calc((264 / 375) * 100vw)',
        '360px-col-m': 'calc(100vw * 0.5398)',
        '440px-col-m': 'calc(100vh * 0.6597)',
        '482px-col-m': 'calc((482 / 375) * 100vw)',
        '615px-col-m': 'calc((615 / 375) * 100vw)',
        'pt-148px-row': 'calc(148 / 1080 * 100vh)',
        'pt-312px-row': 'calc(312 / 1080 * 100vh)',
        'pt-20px-row': 'calc(20 / 1920 * 100vw)',
        'px-396px-row': 'calc(396 / 1920 * 100vw)',
        '22.5px-row': 'calc(22.5 / 1920 * 100vw)',
        '916px-col': 'calc(100vh * 0.8481)'
      },
      gap: {
        'custom-3vw': 'calc(3% * 88vw / 100)',
        'custom-16px': 'calc(100vw * (16 / 1920))',
        'custom-8px-m': 'calc(100vw * (8 / 375))',
        'custom-24px-m': 'calc(100vw * (24 / 375))',
        '260px-col': 'calc(100vh * 0.2407)',
        '300px-col': 'calc(100vh * 0.2778)',
        '307px-col': 'calc(100vh * 0.2843)',
        '354px-col': 'calc(100vh * 0.354)',
        '361px-col': 'calc(100vh * 0.3343)',
        '401px-col': 'calc(100vh * 0.3713)',
        '760px-col': 'calc(100vh * 0.7037)',
        '916px-col': 'calc(100vh * 0.8481)'
      },
      fontSize: {
        '14px': ['calc((100vw * 0.00729 + 100vh * 0.01296) / 2)', { lineHeight: '1.35' }],
        '16px': ['calc((100vw * 0.00833 + 100vh * 0.01481) / 2)', { lineHeight: '1.35' }],
        '18px': ['calc((100vw * 0.00938 + 100vh * 0.01667) / 2)', { lineHeight: '1.35' }],
        '20px': ['calc((100vw * 0.0104 + 100vh * 0.0185) / 2)', { lineHeight: '1.35' }],
        '22px': ['calc((100vw * 0.01145 + 100vh * 0.02036) / 2)', { lineHeight: '1.35' }],
        '24px': ['calc((100vw * 0.0125 + 100vh * 0.02222) / 2)', { lineHeight: '1.35' }],
        '28px': ['calc((100vw * 0.01458 + 100vh * 0.02593) / 2)', { lineHeight: '1.35' }],
        '12px-m': ['calc((100vw * 0.032 + 100vh * 0.01772) / 2)', { lineHeight: '1.35' }],
        '14px-m': ['calc((100vw * 0.03733 + 100vh * 0.02099) / 2)', { lineHeight: '1.35' }],
        '16px-m': ['calc((100vw * 0.04267 + 100vh * 0.02399) / 2)', { lineHeight: '1.35' }],
        '18px-m': ['calc((100vw * 0.048 + 100vh * 0.02698) / 2)', { lineHeight: '1.35' }],
        '20px-m': ['calc((100vw * 0.05333 + 100vh * 0.02999) / 2)', { lineHeight: '1.35' }],
        '22px-m': ['calc((100vw * 22 / 375) + (100vh * 22 / 742)) / 2)', { lineHeight: '1.35' }],
        '24px-m': ['calc((100vw * 24 / 375) + (100vh * 24 / 742)) / 2)', { lineHeight: '1.35' }],
        '28px-m': ['calc((100vw * 28 / 375) + (100vh * 28 / 742)) / 2)', { lineHeight: '1.35' }]
      },
      letterSpacing: {
        '0.24px': '-0.015rem',
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
        'sign-up': 'var(--sign-up-bg-color)',
        pick: 'var(--pick-color)',
        'progress-total-color': 'var(--progress-total-color)',
        'progress-current-color': 'var(--progress-current-color)',
        'progress-border-color': 'var(--progress-border-color)',
        'font-color': 'var(--font-color)',
        'modal-font-color': 'var(--modal-font-color)',
        'error-color': 'var(--error-color)',
        'input-color': 'var(--input-color)',
        'input-disable-color': 'var(--input-disable-color)',
        validation: 'var(--validation-color)',
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
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }: { addUtilities: AddUtilities }) {
      addUtilities({
        '.custom-terms-scrollbar': {
          '&::-webkit-scrollbar': {
            width: 'calc(100vw * 0.00417) !important'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--text-button-disable-color) !important',
            borderRadius: '16px !important',
            border: '2px solid var(--validation-color) !important',
            cursor: 'pointer'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--sign-up-bg-color) !important'
          }
        },
        '.custom-terms-scrollbar-mobile': {
          '&::-webkit-scrollbar': {
            width: 'calc(100vw * 0.02133) !important'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--text-button-disable-color) !important',
            borderRadius: '16px !important',
            border: '2px solid var(--validation-color) !important',
            cursor: 'pointer'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--sign-up-bg-color) !important'
          }
        },
        '.small-custom-terms-scrollbar': {
          '&::-webkit-scrollbar': {
            width: 'calc(100vw * 0.00417) !important',
            height: 'calc(100vh * 0.0176) !important'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'white !important',
            borderRadius: '16px !important',
            border: '2px solid var(--validation-color) !important',
            cursor: 'pointer'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--sign-up-bg-color) !important'
          }
        }
      });
    }
  ]
} satisfies Config;

export default config;
