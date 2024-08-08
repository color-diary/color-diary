"use client"
import React, { useState } from 'react'
import Input from '../common/Input';
import { InputStateType } from '@/types/input.type';
import Button from '../common/Button';
import axios from 'axios';

interface ChangeNicknameModalProps {
    onClose: () => void;
  }

const ChangeNicknameModal = ({onClose}: ChangeNicknameModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleClickLogIn = async (): Promise<void> => {

    const data = { email,password };
    try {
      const response = await axios.post('/api/auth/check-password', data);
      if (response.status === 200) {
      onClose();
      console.log('인증성공')
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className='flex px-[735px] py-[373.5px] justify-center items-center flex-shrink-0 '>
        <div className='flex flex-col items-start self-stretch bg-white px-8 py-8 rounded-2xl text-20px font-normal'>
            <span>정보 수정을 위해서는 비밀번호 입력이 필요해요</span>
            <span>정말 정보를 수정하시겠어요?</span>
            <div className='mt-6 mb-6 w-full'>
            <Input
                id="email"
                type="email"
                value={email}
                setValue={setEmail}
                label="이메일"
                placeholder="이메일을 입력해주세요."
              />
                </div>

                <div className='mb-6 w-full'>
            <Input
                id="password"
                type="password"
                value={password}
                setValue={setPassword}
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
              />
          </div>
           <div className='flex justify-between items-start gap-3 self-stretch'>
            <Button onClick={handleClickLogIn}>정보수정 하기</Button>
            <Button onClick={onClose}>정보수정 취소하기</Button>
           </div>
        </div>
    </div>
  )
}

export default ChangeNicknameModal