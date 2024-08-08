'use client';
import { InputStateType } from '@/types/input.type';
import { ChangeEvent, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from './DropDown';
import TextareaInput from '../common/TextareaInput';

interface ServiceModalProps {
  onClose: () => void;
}

const ServiceModal = ({ onClose }: ServiceModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [emailState, setEmailState] = useState<InputStateType>('default');
  const [text, setText] = useState<string>('');
  const maxLength = 500;

  const handleTextChange = (e: any) => {
    if (e.target.value.length <= maxLength) {
      setText(e.target.value);
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;

    setEmail(newEmail);
    setEmailState(() => {
      if (newEmail === '') return 'default';
      else {
        if (!validateEmail(newEmail)) return 'error';
        else return 'filled';
      }
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  return (
    <div className='flex flex-col w-744px-row'>
      <div className="flex flex-col gap-32px-col px-96px-row pt-36px-col pb-56px-col rounded-5xl bg-sign-up border-4 border-border-color ">
        <div className="flex flex-col items-end self-stretch gap-1">
          <span className=' cursor-pointer'>
            <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4.9068 5.05908L4.9752 4.97508C5.07463 4.87587 5.20571 4.81468 5.34561 4.80219C5.48551 4.78969 5.62536 4.82667 5.7408 4.90668L5.8248 4.97508L12 11.1515L18.1752 4.97508C18.2746 4.87587 18.4057 4.81468 18.5456 4.80219C18.6855 4.78969 18.8254 4.82667 18.9408 4.90668L19.0248 4.97508C19.124 5.07451 19.1852 5.20559 19.1977 5.34549C19.2102 5.48539 19.1732 5.62524 19.0932 5.74068L19.0248 5.82468L12.8484 11.9999L19.0248 18.1751C19.124 18.2745 19.1852 18.4056 19.1977 18.5455C19.2102 18.6854 19.1732 18.8252 19.0932 18.9407L19.0248 19.0247C18.9254 19.1239 18.7943 19.1851 18.6544 19.1976C18.5145 19.2101 18.3746 19.1731 18.2592 19.0931L18.1752 19.0247L12 12.8483L5.8248 19.0247C5.72537 19.1239 5.59429 19.1851 5.45439 19.1976C5.31449 19.2101 5.17464 19.1731 5.0592 19.0931L4.9752 19.0247C4.87599 18.9253 4.81481 18.7942 4.80231 18.6543C4.78981 18.5144 4.82679 18.3745 4.9068 18.2591L4.9752 18.1751L11.1516 11.9999L4.9752 5.82468C4.87599 5.72525 4.81481 5.59417 4.80231 5.45427C4.78981 5.31437 4.82679 5.17452 4.9068 5.05908Z" fill="#080808" />
          </svg>
          </span>
          <h1 className="text-center self-stretch text-24px font-[700] mb-4 tracking-0.48px">문의하기</h1>
        </div>
        <Input
          type="email"
          state={emailState}
          value={email}
          setValue={setEmail}
          onChange={handleChangeEmail}
          label="답변받을 이메일을 입력해주세요."
          validationMessage="ex)abcd@gmail.com"
          placeholder="이메일을 입력해주세요.  "
        />
        <Dropdown />

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='text-18px font-medium'>문의사항을 작성해주세요</label>
          <div className='flex flex-col border-[1px] border-[#A1A1A1] rounded-lg px-[16px] py-[8px] bg-white '>
          <textarea placeholder={`문의 하실 내용을 작성해주세요.
ex)일기의 날짜가 입력이 안돼요.`}
            className='w-full  resize-none h-160px-row outline-none text-18px'
            onChange={handleTextChange}
          />
          <div className='text-right bg-white text-14px text-[#A1A1A1]'>
            {text.length}/{maxLength}
          </div>
          </div>
          
        </div>

        <div className="w-full flex items-end justify-end self-stretch gap-16px-row mt-2 ">
          <Button
            priority="secondary"
            size={'lg'}
            onClick={onClose}

          >
            문의사항 취소하기
          </Button>
          <Button
            size={'lg'}
            onClick={onClose}

          >
            문의사항 보내기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
