import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';

const buttonVariant = cva(
  'inline-flex items-center py-4px-col text-center text-16px font-normal tracking-0.32px transition',
  {
    variants: {
      state: {
        default: 'cursor-pointer text-tertiary-default active:text-tertiary-pressed',
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
          <span className="w-24px-row h-24px-col flex items-center justify-center">
            {icon ? (
              icon
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M14.8235 19.0246C14.7112 19.1373 14.5587 19.2007 14.3996 19.2009C14.2405 19.2011 14.0878 19.1381 13.9751 19.0258L7.39433 12.4678C7.33265 12.4065 7.2837 12.3336 7.2503 12.2532C7.2169 12.1729 7.19971 12.0868 7.19971 11.9998C7.19971 11.9128 7.2169 11.8267 7.2503 11.7464C7.2837 11.6661 7.33265 11.5932 7.39433 11.5318L13.9751 4.97502C14.0306 4.9178 14.0968 4.87219 14.1701 4.84085C14.2433 4.80951 14.3221 4.79307 14.4017 4.7925C14.4814 4.79192 14.5604 4.80721 14.6341 4.83749C14.7078 4.86776 14.7747 4.9124 14.831 4.96882C14.8872 5.02523 14.9317 5.09228 14.9617 5.16606C14.9918 5.23984 15.0069 5.31886 15.0061 5.39853C15.0053 5.47819 14.9886 5.5569 14.9571 5.63005C14.9255 5.70321 14.8797 5.76935 14.8223 5.82462L8.62553 11.9998L14.8223 18.1762C14.935 18.2886 14.9984 18.4411 14.9986 18.6002C14.9988 18.7593 14.9359 18.9119 14.8235 19.0246Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        }
        {children}
      </button>
    );
};

export default TextButton;
