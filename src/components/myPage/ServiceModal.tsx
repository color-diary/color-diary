import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ServiceInput from '../common/ServiceInput';
import Button from '../common/Button';
import Dropdown from './DropDown';
import { WhiteXicon, GreenXicon } from './assets/Xicon';
import { WhiteMailIcon } from './assets/Mail';

interface FormData {
  setEmail: string;
  textarea: string;
  dropdown: string;
}

interface ServiceModalProps {
  onClose: () => void;
}

const ServiceModal = ({ onClose }: ServiceModalProps) => {
  const maxLength = 500;

  const { register, handleSubmit, watch, formState: { errors, isSubmitted } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = data => {
    console.log(data);
    onClose();
  };

  const textareaValue = watch('textarea', '');

  const handleEnterDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();  
      handleSubmit(onSubmit)(); 
    }
  };

  return (
    <div className='flex flex-col px-20px-row w-full md:w-744px-row'>
      <div className="flex flex-col gap-32px-col px-4 pt-4 pb-6 md:px-96px-row md:pt-36px-col md:pb-56px-col rounded-5xl bg-sign-up border-4 border-border-color">
        <div className="flex flex-col items-end self-stretch gap-1">
          <span className='cursor-pointer' onClick={onClose}>
            <WhiteXicon />
          </span>
          <h1 className="text-center self-stretch text-18px-m md:text-24px font-[700] mb-4 tracking-0.48px">문의하기</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col mb-[24px]'>
          <ServiceInput
            type="text"
            label="이메일을 입력해주세요"
            {...register("setEmail", {
              required: "이메일이 입력되지 않았어요.",
              pattern: {
                value: /^[a-zA-Z0-9]{4,10}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "유효한 이메일 형식이 아닙니다. ex)abcd@gmail.com"
              }
            })}
            placeholder="이메일을 입력해주세요."
            state={errors.setEmail ? 'error' : isSubmitted ? 'filled' : 'default'}
            helperMessage={errors.setEmail?.message}
            onKeyDown={handleEnterDown}  
          />
          </div>
          <Dropdown 
           
          />

          <div className='flex flex-col gap-2'>
            <label htmlFor="textarea" className={`text-16px-m md:text-18px font-medium ${isSubmitted
              ? errors.textarea || textareaValue.length > maxLength
                ? 'text-[#F02222]' 
                : 'text-[#25B18C]'  
              : 'text-font-color'
              }`}
            >
              문의사항을 작성해주세요
            </label>
            <div className='flex flex-col mb-[42px]'>
            <div className={`flex flex-col border-[1px] rounded-lg px-16px-row py-8px-col bg-white  ${isSubmitted
              ? errors.textarea || textareaValue.length > maxLength
                ? 'border-[#F02222]' 
                : 'border-[#25B18C]'  
              : 'border-[#A1A1A1]'
              }`}>
              <textarea
                {...register("textarea", {
                  required: "문의 사항이 입력되지않았어요",
                  minLength: {
                    value: 20,
                    message: "20자 이상입력바람"
                  },
                  maxLength: {
                    value: maxLength,
                    message: `최대 ${maxLength}자까지 입력 가능합니다.`
                  },
                })}
                placeholder={`문의 하실 내용을 20자 이상작성해주세요.
ex)일기의 날짜가 입력이 안돼요.`}
                className='w-full resize-none h-135px-col-m md:h-160px-row outline-none text-14px-m md:text-18px'
                onKeyDown={handleEnterDown}  
              />
              <div className='text-right bg-white text-12px-m md:text-14px text-[#A1A1A1]'>
                {textareaValue.length}/{maxLength}
              </div>
            </div>
            {errors.textarea && <span className="text-error-color md:text-18px text-14px-m mt-[6px]">{errors.textarea.message}</span>}
            </div>
          </div>
          

          <div className="flex w-full justify-center md:items-end md:justify-end self-stretch gap-16px-col md:gap-16px-row mt-8px-col">
            <Button
              priority="secondary"
              size={'lg'}
              onClick={onClose}
              icon={<GreenXicon />}
            >
              문의사항 취소하기
            </Button>
            <Button
              type='submit'
              size={'lg'}
              icon={<WhiteMailIcon />}
            >
              문의사항 보내기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
