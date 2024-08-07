'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ChangeEvent, ComponentProps, Dispatch, SetStateAction } from 'react';
import XIconBlack from './assets/XIconBlack';
import XIconRed from './assets/XIconRed';

const labelVariant = cva('self-stretch font-medium md:text-18px md:tracking-0.36px text-16px-m tracking-0.32px', {
  variants: {
    state: {
      default: 'text-font-color cursor-pointer',
      filled: 'text-default cursor-pointer',
      error: 'text-error-color cursor-pointer',
      disable: 'text-text-button-disable cursor-not-allowed'
    }
  },
  defaultVariants: {
    state: 'default'
  }
});

const inputVariant = cva(
  'w-full flex justify-center md:pl-16px-row md:pr-48px-row pl-16px-row-m pr-48px-row-m self-stretch border rounded-lg font-normal md:py-12px-col md:text-18px md:tracking-0.36px py-8px-col-m text-14px-m tracking-0.28px',
  {
    variants: {
      state: {
        default:
          'bg-white border-input-color focus:border-font-color text-input-color focus:text-font-color placeholder:text-input-color',
        filled: 'bg-white border-default text-font-color',
        error: 'bg-white border-error-color text-error-color',
        disable: 'bg-input-disable-color border-text-button-disable text-text-button-disable cursor-not-allowed'
      }
    },
    defaultVariants: {
      state: 'default'
    }
  }
);

const iconVariant = cva(
  'absolute md:right-16px-row right-16px-row-m cursor-pointer md:w-24px-row md:h-24px-col w-24px-row-m h-24px-col-m md:bottom-12px-col md:top-12px-col top-1/2 md:translate-y-0 -translate-y-1/2',
  {
    variants: {
      state: {
        filled: 'text-error',
        error: 'text-font-color-color'
      }
    }
  }
);

const textVariant = cva('font-normal md:text-18px md:tracking-0.36px text-14px-m tracking-0.28px', {
  variants: {
    state: {
      default: 'text-validation',
      filled: 'text-validation',
      error: 'text-error-color',
      disable: 'text-text-button-disable'
    }
  },
  defaultVariants: {
    state: 'default'
  }
});

type InputVariantProps = VariantProps<typeof inputVariant>;

type InputProps = {
  label: string;
  validationMessage?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
} & InputVariantProps &
  ComponentProps<'input'>;

const Input = ({ label, validationMessage, state, id, value, setValue, ...props }: InputProps) => {
  const inputId = id || crypto.randomUUID();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

  const clearInput = (): void => setValue('');

  return (
    <div className="w-full flex flex-col items-start md:gap-8px-col gap-8px-col-m">
      <label htmlFor={inputId} className={labelVariant({ state })}>
        {label}
      </label>
      <div className="relative w-full h-fit">
        <input
          id={inputId}
          className={inputVariant({ state })}
          value={value}
          onChange={handleChange}
          disabled={state === 'disable'}
          {...props}
        />
        {(state === 'filled' || state === 'error') && (
          <button type="button" className={iconVariant({ state })} onClick={clearInput}>
            {state === 'filled' ? <XIconBlack /> : <XIconRed />}
          </button>
        )}
      </div>
      {validationMessage && (
        <span id={inputId} className={textVariant({ state })}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
