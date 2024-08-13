import React, { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const labelVariant = cva('self-stretch font-medium md:text-18px md:tracking-0.36px text-16px-m tracking-0.32px', {
  variants: {
    state: {
      default: 'text-font-color cursor-pointer',
      filled: 'text-default cursor-pointer',
      error: 'text-[#F02222] cursor-pointer',
      disable: 'text-text-button-disable cursor-not-allowed'
    }
  },
  defaultVariants: {
    state: 'default'
  }
});

const inputVariant = cva(
    'w-full flex justify-center md:pl-16px-row md:pr-48px-row pl-16px-row-m pr-48px-row-m self-stretch border rounded-lg font-normal md:py-12px-col md:text-18px md:tracking-0.36px py-8px-col-m text-14px-m tracking-0.28px border-[#A1A1A1] outline-none',
    {
      variants: {
        state: {
          default:
            'bg-white border-input-color focus:border-font-color text-input-color focus:text-font-color placeholder:text-input-color',
          filled: 'bg-white border-default text-font-color',
          error: 'bg-white border-[#F02222] text-[#F02222]',
          disable: 'bg-input-disable-color border-text-button-disable text-text-button-disable cursor-not-allowed'
        }
      },
      defaultVariants: {
        state: 'default'
      }
    }
  );


type InputVariantProps = VariantProps<typeof inputVariant>;

type InputProps = {
  label: string;
  state?: 'default' | 'filled' | 'error' | 'disable';
} & InputVariantProps &
  React.ComponentProps<'input'>;

const TestInput = forwardRef<HTMLInputElement, InputProps>(({ label, state, id,  ...props }, ref) => {
  const inputId = id || crypto.randomUUID();

  return (
    <div className="w-full flex flex-col items-start md:gap-8px-col gap-8px-col-m">
      <label htmlFor={inputId} className={labelVariant({ state })}>
        {label}
      </label>
      <div className="relative w-full h-fit">
        <input
          id={inputId}
          ref={ref}
          className={inputVariant({ state })}
          {...props}
        />
      </div>
    </div>
  );
});

export default TestInput;
