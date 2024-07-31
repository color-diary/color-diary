'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ChangeEvent, ComponentProps, Dispatch, SetStateAction } from 'react';

const labelVariant = cva('self-stretch font-medium', {
  variants: {
    state: {
      default: 'text-font-color cursor-pointer',
      filled: 'text-default cursor-pointer',
      error: 'text-error cursor-pointer',
      disable: 'text-text-button-disable cursor-not-allowed'
    },
    device: {
      desktop: 'text-20px tracking-tight',
      mobile: 'text-16px tracking-0.32px'
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

const inputVariant = cva('w-full flex justify-center px-16px-row self-stretch border rounded-lg font-normal', {
  variants: {
    state: {
      default:
        'bg-white border-input-color focus:border-font-color text-input-color focus:text-font-color placeholder:text-input-color',
      filled: 'bg-white border-default text-font-color',
      error: 'bg-white border-error text-error',
      disable: 'bg-input-disable-color border-text-button-disable text-text-button-disable cursor-not-allowed'
    },
    device: {
      desktop: 'py-12px-col text-20px tracking-tight',
      mobile: 'py-8px-col text-14px tracking-0.28px'
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

const iconVariant = cva(
  'absolute right-16px-row top-1/2 transform -translate-y-1/2 cursor-pointer w-24px-row h-24px-col',
  {
    variants: {
      state: {
        filled: 'text-error',
        error: 'text-font-color'
      }
    }
  }
);

const textVariant = cva('font-normal', {
  variants: {
    state: {
      default: 'text-input-color',
      filled: 'text-validation',
      error: 'text-error',
      disable: 'text-text-button-disable'
    },
    device: {
      desktop: 'text-20px tracking-tight',
      mobile: 'text-14px tracking-0.28px'
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

type InputVariantProps = VariantProps<typeof inputVariant>;

type InputProps = {
  label: string;
  validationMessage?: string;
  isFilled?: boolean;
  isError?: boolean;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
} & InputVariantProps &
  ComponentProps<'input'>;

const Input = ({ label, validationMessage, state, device, id, value, setValue, ...props }: InputProps) => {
  const inputId = id || crypto.randomUUID();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

  const clearInput = (): void => setValue('');

  return (
    <div className="relative w-full flex flex-col items-start gap-8px-col">
      <label htmlFor={inputId} className={labelVariant({ state, device })}>
        {label}
      </label>
      <input
        id={inputId}
        className={inputVariant({ state, device })}
        value={value}
        onChange={handleChange}
        disabled={state === 'disable'}
        {...props}
      />
      {(state === 'filled' || state === 'error') && (
        <button type="button" className={iconVariant({ state })} onClick={clearInput}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25">
            <path
              d="M4.90668 5.55908L4.97508 5.47508C5.07451 5.37587 5.20559 5.31468 5.34549 5.30219C5.48539 5.28969 5.62524 5.32667 5.74068 5.40668L5.82468 5.47508L11.9999 11.6515L18.1751 5.47508C18.2745 5.37587 18.4056 5.31468 18.5455 5.30219C18.6854 5.28969 18.8252 5.32667 18.9407 5.40668L19.0247 5.47508C19.1239 5.57451 19.1851 5.70559 19.1976 5.84549C19.2101 5.98539 19.1731 6.12524 19.0931 6.24068L19.0247 6.32468L12.8483 12.4999L19.0247 18.6751C19.1239 18.7745 19.1851 18.9056 19.1976 19.0455C19.2101 19.1854 19.1731 19.3252 19.0931 19.4407L19.0247 19.5247C18.9253 19.6239 18.7942 19.6851 18.6543 19.6976C18.5144 19.7101 18.3745 19.6731 18.2591 19.5931L18.1751 19.5247L11.9999 13.3483L5.82468 19.5247C5.72525 19.6239 5.59417 19.6851 5.45427 19.6976C5.31437 19.7101 5.17452 19.6731 5.05908 19.5931L4.97508 19.5247C4.87587 19.4253 4.81468 19.2942 4.80219 19.1543C4.78969 19.0144 4.82667 18.8745 4.90668 18.7591L4.97508 18.6751L11.1515 12.4999L4.97508 6.32468C4.87587 6.22525 4.81468 6.09417 4.80219 5.95427C4.78969 5.81437 4.82667 5.67452 4.90668 5.55908Z"
              fill="black"
            />
          </svg>
        </button>
      )}
      {validationMessage && (
        <span id={inputId} className={textVariant({ state, device })}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
