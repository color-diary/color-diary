import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';
import ButtonDefault from './assets/ButtonDefault';

const buttonVariant = cva(
  'inline-flex justify-center items-center gap-4px-row text-center font-medium transition border',
  {
    variants: {
      priority: {
        primary: 'text-white',
        secondary: '',
        tertiary: ''
      },
      state: {
        default: 'cursor-pointer',
        disable: 'cursor-not-allowed'
      },
      size: {
        sm: 'px-16px-row py-8px-col text-14px rounded-lg tracking-0.28px',
        md: 'md:px-20px-row md:py-12px-col md:text-16px md:rounded-xl md:tracking-0.32px px-4 py-2 text-sm rounded-lg tracking-0.28px',
        lg: 'md:px-24px-row md:py-12px-col md:text-18px md:rounded-2xl md:tracking-0.36px px-4 py-2 text-sm rounded-lg tracking-0.28px',
        half: 'w-1/2 py-12px-col text-16px rounded-xl tracking-0.32px',
        smFix: 'px-4 py-2 text-sm rounded-lg tracking-0.28px',
        mdFix:
          'md:px-5 md:py-3 md:text-base md:rounded-xl md:tracking-0.32px px-4 py-2 text-sm rounded-lg tracking-0.28px',
        lgFix: 'px-6 py-3 text-lg rounded-2xl tracking-0.36px'
      }
    },
    compoundVariants: [
      {
        priority: 'primary',
        state: 'default',
        className: 'bg-default hover:bg-pressed border-default hover:border-pressed '
      },
      {
        priority: 'primary',
        state: 'disable',
        className: 'bg-disable border-disable'
      },
      {
        priority: 'secondary',
        state: 'default',
        className: 'border-default text-default hover:border-pressed hover:text-pressed'
      },
      {
        priority: 'secondary',
        state: 'disable',
        className: 'border-disable text-disable'
      },
      {
        priority: 'tertiary',
        state: 'default',
        className:
          'border-tertiary-default text-tertiary-default hover:border-tertiary-pressed hover:text-tertiary-pressed'
      },
      {
        priority: 'tertiary',
        state: 'disable',
        className: 'border-tertiary-disable text-tertiary-disable'
      }
    ],
    defaultVariants: { priority: 'primary', state: 'default', size: 'md' }
  }
);

const iconVariant = cva('fill-current flex justify-center items-center', {
  variants: {
    size: {
      sm: 'w-16px-row h-16px-col',
      md: 'md:w-20px-row md:h-20px-col w-4 h-4',
      lg: 'md:w-24px-row md:h-24px-col w-4 h-4',
      half: 'w-20px-row h-20px-col',
      smFix: 'w-4 h-4',
      mdFix: 'md:w-5 md:h-5 w-4 h-4',
      lgFix: 'w-6 h-6'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

type ButtonVariantProps = VariantProps<typeof buttonVariant>;

type ButtonProps = { children: ReactNode; icon?: ReactNode } & ButtonVariantProps &
  (({ href?: undefined } & ComponentProps<'button'>) | ({ href: string } & ComponentProps<typeof Link>));

const Button = ({ priority, state, size, children, icon, ...props }: ButtonProps) => {
  if (props.href) {
    return (
      <Link className={buttonVariant({ priority, state, size })} aria-disabled={state === 'disable'} {...props}>
        {children}
        {<span className={iconVariant({ size })}>{icon ? icon : <ButtonDefault />}</span>}
      </Link>
    );
  } else if (typeof props.href === 'undefined')
    return (
      <button className={buttonVariant({ priority, state, size })} disabled={state === 'disable'} {...props}>
        {children}
        {<span className={iconVariant({ size })}>{icon ? icon : <ButtonDefault />}</span>}
      </button>
    );
};

export default Button;
