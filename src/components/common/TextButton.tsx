import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';
import AngleLeftBlue from './assets/AngleLeftBlue';

const buttonVariant = cva(
  'inline-flex items-center py-4px-col text-center transition font-normal md:text-14px md:tracking-0.28px text-sm tracking-0.28px',
  {
    variants: {
      state: {
        default: 'cursor-pointer text-tertiary-default hover:text-tertiary-pressed',
        disable: 'cursor-not-allowed text-text-button-disable'
      }
    },
    defaultVariants: {
      state: 'default'
    }
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariant>;

type ButtonProps = { children: ReactNode; icon?: ReactNode } & ButtonVariantProps &
  (({ href?: undefined } & ComponentProps<'button'>) | ({ href: string } & ComponentProps<typeof Link>));

const TextButton = ({ state, children, icon, ...props }: ButtonProps) => {
  if (props.href) {
    return (
      <Link className={buttonVariant({ state })} aria-disabled={state === 'disable'} {...props}>
        {children}
      </Link>
    );
  } else if (typeof props.href === 'undefined')
    return (
      <button className={buttonVariant({ state })} disabled={state === 'disable'} {...props}>
        {
          <span className="md:w-24px-row md:h-24px-col w-6 h-6 flex items-center justify-center">
            {icon ? icon : <AngleLeftBlue />}
          </span>
        }
        {children}
      </button>
    );
};

export default TextButton;
