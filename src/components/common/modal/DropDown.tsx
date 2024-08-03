'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, Dispatch, SetStateAction, useState, useRef, useEffect } from 'react';

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

const inputVariant = cva(
  'flex justify-between items-center pl-16px-row pr-48px-row border rounded-lg font-normal',
  {
    variants: {
      state: {
        default:
          'bg-white border-input-color text-input-color placeholder:text-input-color',
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

type DropdownVariantProps = VariantProps<typeof inputVariant>;

type DropdownProps = {
  label: string;
  validationMessage?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  options: string[];
} & DropdownVariantProps &
  ComponentProps<'div'>;

const Dropdown = ({ label, validationMessage, state, device, id, value, setValue, options, ...props }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputWidth, setInputWidth] = useState<string | undefined>(undefined);
  const selectId = id || crypto.randomUUID();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (option: string): void => {
    setValue(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const updateInputWidth = () => {
      if (containerRef.current) {
        setInputWidth(`${containerRef.current.clientWidth}px`);
      }
    };

    updateInputWidth();
    window.addEventListener('resize', updateInputWidth);
    return () => window.removeEventListener('resize', updateInputWidth);
  }, []);

  return (
    <div className="w-full flex flex-col items-start gap-8px-col" ref={containerRef}>
      <label htmlFor={selectId} className={labelVariant({ state: state || 'default', device: device || 'desktop' })}>
        {label}
      </label>
      <div className="relative w-full" style={{ width: inputWidth }}>
        <div
          id={selectId}
          className={`${inputVariant({ state: state || 'default', device: device || 'desktop' })} ${isOpen ? 'border-[#25B18C]' : ''} cursor-pointer`}
          onClick={toggleDropdown}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', borderColor: isOpen ? '#25B18C' : '' }}
        >
          {value || '---------------------문의종류 선택하기---------------------'}
          <svg
            className="absolute right-16px-row top-1/2 transform -translate-y-1/2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {isOpen && (
          <div
            className={`relative z-10 w-full bg-white border rounded-lg mt-2 transition-all duration-300 ease-in-out border-[#25B18C]`}
            style={{ maxHeight: isOpen ? '200px' : '0px', overflow: 'hidden' }}
          >
            <ul>
              {options.map((option, index) => (
                <li
                  key={index}
                  className="px-16px-row py-12px-col cursor-pointer hover:bg-[#DDF8F1]"
                  onClick={() => handleChange(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {validationMessage && (
        <span id={selectId} className={textVariant({ state: state || 'default', device: device || 'desktop' })}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};

export default Dropdown;
