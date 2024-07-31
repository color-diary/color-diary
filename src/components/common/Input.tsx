'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';

const labelVariant = cva('', {
  variants: {
    state: {
      default: '',
      filled: '',
      error: '',
      disable: ''
    },
    device: {
      desktop: '',
      mobile: ''
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

const inputVariant = cva('border', {
  variants: {
    state: {
      default: '',
      filled: '',
      error: '',
      disable: ''
    },
    device: {
      desktop: '',
      mobile: ''
    }
  },
  defaultVariants: {
    state: 'default',
    device: 'desktop'
  }
});

const textVariant = cva('', {
  variants: {
    state: {
      default: '',
      filled: '',
      error: '',
      disable: ''
    },
    device: {
      desktop: '',
      mobile: ''
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
} & InputVariantProps &
  ComponentProps<'input'>;

const Input = ({ label, validationMessage, state, device, id, ...props }: InputProps) => {
  const inputId = id || crypto.randomUUID();

  return (
    <div>
      <label htmlFor={inputId} className={labelVariant({ state, device })}>
        {label}
      </label>
      <input id={inputId} className={inputVariant({ state, device })} {...props} />
      {validationMessage && <span className={textVariant({ state, device })}>{validationMessage}</span>}
    </div>
  );
};

export default Input;
