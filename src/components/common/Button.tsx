import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';

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
        md: 'px-20px-row py-12px-col text-16px rounded-xl tracking-0.32px',
        lg: 'px-24px-row py-12px-col text-18px rounded-2xl tracking-0.36px',
        half: 'w-1/2 py-12px-col text-16px rounded-xl tracking-0.32px',
        smFix: 'px-4 py-2 text-sm rounded-lg tracking-0.28px',
        mdFix: 'px-5 py-3 text-base rounded-xl tracking-0.32px',
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
      md: 'w-20px-row h-20px-col',
      lg: 'w-24px-row h-24px-col',
      half: 'w-20px-row h-20px-col',
      smFix: 'w-4 h-4',
      mdFix: 'w-5 h-5',
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
        {
          <span className={iconVariant({ size })}>
            {icon ? (
              icon
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  d="M7.5 11C7.89782 11 8.27936 11.158 8.56066 11.4393C8.84196 11.7206 9 12.1022 9 12.5V16.5C9 16.8978 8.84196 17.2794 8.56066 17.5607C8.27936 17.842 7.89782 18 7.5 18H3.5C3.10218 18 2.72064 17.842 2.43934 17.5607C2.15804 17.2794 2 16.8978 2 16.5V12.5C2 12.1022 2.15804 11.7206 2.43934 11.4393C2.72064 11.158 3.10218 11 3.5 11H7.5ZM16.5 11C16.8978 11 17.2794 11.158 17.5607 11.4393C17.842 11.7206 18 12.1022 18 12.5V16.5C18 16.8978 17.842 17.2794 17.5607 17.5607C17.2794 17.842 16.8978 18 16.5 18H12.5C12.1022 18 11.7206 17.842 11.4393 17.5607C11.158 17.2794 11 16.8978 11 16.5V12.5C11 12.1022 11.158 11.7206 11.4393 11.4393C11.7206 11.158 12.1022 11 12.5 11H16.5ZM7.5 12H3.5C3.36739 12 3.24021 12.0527 3.14645 12.1464C3.05268 12.2402 3 12.3674 3 12.5V16.5C3 16.6326 3.05268 16.7598 3.14645 16.8536C3.24021 16.9473 3.36739 17 3.5 17H7.5C7.63261 17 7.75979 16.9473 7.85355 16.8536C7.94732 16.7598 8 16.6326 8 16.5V12.5C8 12.3674 7.94732 12.2402 7.85355 12.1464C7.75979 12.0527 7.63261 12 7.5 12ZM16.5 12H12.5C12.3674 12 12.2402 12.0527 12.1464 12.1464C12.0527 12.2402 12 12.3674 12 12.5V16.5C12 16.6326 12.0527 16.7598 12.1464 16.8536C12.2402 16.9473 12.3674 17 12.5 17H16.5C16.6326 17 16.7598 16.9473 16.8536 16.8536C16.9473 16.7598 17 16.6326 17 16.5V12.5C17 12.3674 16.9473 12.2402 16.8536 12.1464C16.7598 12.0527 16.6326 12 16.5 12ZM7.5 2C7.89782 2 8.27936 2.15804 8.56066 2.43934C8.84196 2.72064 9 3.10218 9 3.5V7.5C9 7.89782 8.84196 8.27936 8.56066 8.56066C8.27936 8.84196 7.89782 9 7.5 9H3.5C3.10218 9 2.72064 8.84196 2.43934 8.56066C2.15804 8.27936 2 7.89782 2 7.5V3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H7.5ZM16.5 2C16.8978 2 17.2794 2.15804 17.5607 2.43934C17.842 2.72064 18 3.10218 18 3.5V7.5C18 7.89782 17.842 8.27936 17.5607 8.56066C17.2794 8.84196 16.8978 9 16.5 9H12.5C12.1022 9 11.7206 8.84196 11.4393 8.56066C11.158 8.27936 11 7.89782 11 7.5V3.5C11 3.10218 11.158 2.72064 11.4393 2.43934C11.7206 2.15804 12.1022 2 12.5 2H16.5ZM7.5 3H3.5C3.36739 3 3.24021 3.05268 3.14645 3.14645C3.05268 3.24021 3 3.36739 3 3.5V7.5C3 7.63261 3.05268 7.75979 3.14645 7.85355C3.24021 7.94732 3.36739 8 3.5 8H7.5C7.63261 8 7.75979 7.94732 7.85355 7.85355C7.94732 7.75979 8 7.63261 8 7.5V3.5C8 3.36739 7.94732 3.24021 7.85355 3.14645C7.75979 3.05268 7.63261 3 7.5 3ZM16.5 3H12.5C12.3674 3 12.2402 3.05268 12.1464 3.14645C12.0527 3.24021 12 3.36739 12 3.5V7.5C12 7.63261 12.0527 7.75979 12.1464 7.85355C12.2402 7.94732 12.3674 8 12.5 8H16.5C16.6326 8 16.7598 7.94732 16.8536 7.85355C16.9473 7.75979 17 7.63261 17 7.5V3.5C17 3.36739 16.9473 3.24021 16.8536 3.14645C16.7598 3.05268 16.6326 3 16.5 3Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        }
      </Link>
    );
  } else if (typeof props.href === 'undefined')
    return (
      <button className={buttonVariant({ priority, state, size })} disabled={state === 'disable'} {...props}>
        {children}
        {
          <span className={iconVariant({ size })}>
            {icon ? (
              icon
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  d="M7.5 11C7.89782 11 8.27936 11.158 8.56066 11.4393C8.84196 11.7206 9 12.1022 9 12.5V16.5C9 16.8978 8.84196 17.2794 8.56066 17.5607C8.27936 17.842 7.89782 18 7.5 18H3.5C3.10218 18 2.72064 17.842 2.43934 17.5607C2.15804 17.2794 2 16.8978 2 16.5V12.5C2 12.1022 2.15804 11.7206 2.43934 11.4393C2.72064 11.158 3.10218 11 3.5 11H7.5ZM16.5 11C16.8978 11 17.2794 11.158 17.5607 11.4393C17.842 11.7206 18 12.1022 18 12.5V16.5C18 16.8978 17.842 17.2794 17.5607 17.5607C17.2794 17.842 16.8978 18 16.5 18H12.5C12.1022 18 11.7206 17.842 11.4393 17.5607C11.158 17.2794 11 16.8978 11 16.5V12.5C11 12.1022 11.158 11.7206 11.4393 11.4393C11.7206 11.158 12.1022 11 12.5 11H16.5ZM7.5 12H3.5C3.36739 12 3.24021 12.0527 3.14645 12.1464C3.05268 12.2402 3 12.3674 3 12.5V16.5C3 16.6326 3.05268 16.7598 3.14645 16.8536C3.24021 16.9473 3.36739 17 3.5 17H7.5C7.63261 17 7.75979 16.9473 7.85355 16.8536C7.94732 16.7598 8 16.6326 8 16.5V12.5C8 12.3674 7.94732 12.2402 7.85355 12.1464C7.75979 12.0527 7.63261 12 7.5 12ZM16.5 12H12.5C12.3674 12 12.2402 12.0527 12.1464 12.1464C12.0527 12.2402 12 12.3674 12 12.5V16.5C12 16.6326 12.0527 16.7598 12.1464 16.8536C12.2402 16.9473 12.3674 17 12.5 17H16.5C16.6326 17 16.7598 16.9473 16.8536 16.8536C16.9473 16.7598 17 16.6326 17 16.5V12.5C17 12.3674 16.9473 12.2402 16.8536 12.1464C16.7598 12.0527 16.6326 12 16.5 12ZM7.5 2C7.89782 2 8.27936 2.15804 8.56066 2.43934C8.84196 2.72064 9 3.10218 9 3.5V7.5C9 7.89782 8.84196 8.27936 8.56066 8.56066C8.27936 8.84196 7.89782 9 7.5 9H3.5C3.10218 9 2.72064 8.84196 2.43934 8.56066C2.15804 8.27936 2 7.89782 2 7.5V3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H7.5ZM16.5 2C16.8978 2 17.2794 2.15804 17.5607 2.43934C17.842 2.72064 18 3.10218 18 3.5V7.5C18 7.89782 17.842 8.27936 17.5607 8.56066C17.2794 8.84196 16.8978 9 16.5 9H12.5C12.1022 9 11.7206 8.84196 11.4393 8.56066C11.158 8.27936 11 7.89782 11 7.5V3.5C11 3.10218 11.158 2.72064 11.4393 2.43934C11.7206 2.15804 12.1022 2 12.5 2H16.5ZM7.5 3H3.5C3.36739 3 3.24021 3.05268 3.14645 3.14645C3.05268 3.24021 3 3.36739 3 3.5V7.5C3 7.63261 3.05268 7.75979 3.14645 7.85355C3.24021 7.94732 3.36739 8 3.5 8H7.5C7.63261 8 7.75979 7.94732 7.85355 7.85355C7.94732 7.75979 8 7.63261 8 7.5V3.5C8 3.36739 7.94732 3.24021 7.85355 3.14645C7.75979 3.05268 7.63261 3 7.5 3ZM16.5 3H12.5C12.3674 3 12.2402 3.05268 12.1464 3.14645C12.0527 3.24021 12 3.36739 12 3.5V7.5C12 7.63261 12.0527 7.75979 12.1464 7.85355C12.2402 7.94732 12.3674 8 12.5 8H16.5C16.6326 8 16.7598 7.94732 16.8536 7.85355C16.9473 7.75979 17 7.63261 17 7.5V3.5C17 3.36739 16.9473 3.24021 16.8536 3.14645C16.7598 3.05268 16.6326 3 16.5 3Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        }
      </button>
    );
};

export default Button;
