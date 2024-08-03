'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ChangeEvent, ComponentProps, Dispatch, SetStateAction } from 'react';

const labelVariant = cva('self-stretch font-medium', {
  variants: {
    state: {
      default: 'text-font-color cursor-pointer',
      filled: 'text-default cursor-pointer',
      error: 'text-error-color cursor-pointer',
      disable: 'text-text-button-disable cursor-not-allowed'
    },
    device: {
      desktop: 'text-18px tracking-0.36px',
      mobile: 'text-16px tracking-0.32px'
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

const textareaVariant = cva(
  'w-full flex justify-center pl-16px-row pr-16px-row self-stretch border rounded-lg font-normal resize-none', // resize-none 추가
  {
    variants: {
      state: {
        default:
          'bg-white border-input-color focus:border-font-color text-input-color focus:text-font-color placeholder:text-input-color',
        filled: 'bg-white border-default text-font-color',
        error: 'bg-white border-error-color text-error-color',
        disable: 'bg-input-disable-color border-text-button-disable text-text-button-disable cursor-not-allowed'
      },
      device: {
        desktop: 'py-12px-col text-18px tracking-0.36px',
        mobile: 'py-8px-col text-14px tracking-0.28px'
      }
    },
    defaultVariants: {
      state: 'default',
      device: 'desktop'
    }
  }
);

const textVariant = cva('font-normal', {
  variants: {
    state: {
      default: 'text-validation',
      filled: 'text-validation',
      error: 'text-error-color',
      disable: 'text-text-button-disable'
    },
    device: {
      desktop: 'text-18px tracking-0.36px',
      mobile: 'text-14px tracking-0.28px'
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

type TextareaVariantProps = VariantProps<typeof textareaVariant>;

type TextareaProps = {
  label: string;
  validationMessage?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  maxLength: number;
} & TextareaVariantProps &
  ComponentProps<'textarea'>;

const Textarea = ({ label, validationMessage, state, device, id, value, setValue, maxLength, ...props }: TextareaProps) => {
  const textareaId = id || crypto.randomUUID();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    if (e.target.value.length <= maxLength) {
      setValue(e.target.value);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-8px-col">
      <label htmlFor={textareaId} className={labelVariant({ state, device })}>
        {label}
      </label>
      <div className="relative w-full h-fit">
        <textarea
          id={textareaId}
          className={textareaVariant({ state, device })}
          value={value}
          onChange={handleChange}
          rows={6}
          disabled={state === 'disable'}
          {...props}
        />
        <div className="absolute bottom-2 right-4 text-input-color">{`${value.length}/${maxLength}`}</div>
      </div>
      {validationMessage && (
        <span id={textareaId} className={textVariant({ state, device })}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};

export default Textarea;
