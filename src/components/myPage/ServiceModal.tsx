'use client';
import { InputStateType } from '@/types/input.type';
import { ChangeEvent, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from './DropDown';
import { WhiteXicon, GreenXicon } from './assets/Xicon';
import { WhiteMailIcon } from './assets/Mail';
import { useForm } from 'react-hook-form';

interface ServiceModalProps {
  onClose: () => void;
}

const ServiceModal = ({ onClose }: ServiceModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [emailState, setEmailState] = useState<InputStateType>('default');
  const [text, setText] = useState<string>('');
  const maxLength = 500;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText.length <= maxLength) {
      setText(inputText);
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
    <div className='flex flex-col px-20px-row w-full  md:w-744px-row'>
      <div className="flex flex-col gap-32px-col px-4 pt-4 pb-6 md:px-96px-row md:pt-36px-col md:pb-56px-col rounded-5xl bg-sign-up border-4 border-border-color ">
        <div className="flex flex-col items-end self-stretch gap-1">
          <span className=' cursor-pointer' onClick={onClose}>
            <WhiteXicon />
          </span>
          <h1 className="text-center self-stretch text-18px-m md:text-24px font-[700] mb-4 tracking-0.48px">문의하기</h1>
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
          <label htmlFor="" className='text-16px-m md:text-18px font-medium'>문의사항을 작성해주세요</label>
          <div className='flex flex-col border-[1px] border-[#A1A1A1] rounded-lg px-16px-row py-8px-col bg-white '>
          <textarea placeholder={`문의 하실 내용을 작성해주세요.
ex)일기의 날짜가 입력이 안돼요.`}
            className='w-full resize-none h-135px-col-m md:h-160px-row outline-none text-14px-m md:text-18px'
            onChange={handleTextChange}
            value={text} 
          />
          <div className='text-right bg-white text-12px-m md:text-14px text-[#A1A1A1]'>
            {text.length}/{maxLength}
          </div>
          </div>
          
        </div>

        <div className="flex w-full justify-center md:items-end md:justify-end self-stretch gap-16px-col md:gap-16px-row mt-8px-col ">
          <Button
            priority="secondary"
            size={'lg'}
            onClick={onClose}
            icon={<GreenXicon />}
          >
            문의사항 취소하기
          </Button>
          <Button
            size={'lg'}
            onClick={onClose}
           icon={<WhiteMailIcon />}
          >
            문의사항 보내기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
