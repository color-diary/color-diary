'use client';

import { useToast } from '@/providers/toast.context';
import axios from 'axios';
import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { Edit } from './assets/Edit';
import { GreenXIcon } from './assets/XIcons';

interface ChangeNicknameModalProps {
  onClose: () => void;
  onSuccess: (success: boolean) => void;
}

const ChangeNicknameModal = ({ onClose, onSuccess }: ChangeNicknameModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const toast = useToast();

  const handleClickLogIn = async (): Promise<void> => {
    const data = { email, password };
    try {
      const response = await axios.post('/api/auth/check-password', data);
      if (response.status === 200) {
        onSuccess(true);
        toast.on({ label: '인증성공' });
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.on({ label: '인증 실패' });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-[26px]">
      <div className="flex flex-col items-start self-stretch bg-white px-8 py-8 rounded-2xl">
        <div className="flex flex-col text-16px-m md:text-20px font-normal mb-8">
          <span className="block md:hidden">
            정보 수정을 위해서는 비밀번호 입력이 필요해요.정말 정보를 수정하시겠어요?
          </span>
          <span className=" hidden md:block">
            <p>정보수정을 위해서는 비밀번호와 이메일 정보가 필요해요.</p>
            <p>정말 정보를 수정하시겠어요?</p>
          </span>
        </div>
        <div className="flex flex-col self-stretch w-full">
          <Input
            id="email"
            type="email"
            value={email}
            setValue={setEmail}
            label="이메일"
            placeholder="이메일을 입력해주세요."
          />
          <label className="text-14px-m md:text-18px mt-2 mb-4 text-[#878787]">가입한 이메일을 입력해주세요</label>
          <Input
            id="password"
            type="password"
            value={password}
            setValue={setPassword}
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
          />
          <label className="text-14px-m md:text-18px mt-2 mb-8 text-[#878787]">
            현재 사용중인 비밀번호를 입력해주세요
          </label>
        </div>
        <div className="flex  justify-center gap-10 md:justify-end items-start md:gap-3 self-stretch">
          <Button onClick={handleClickLogIn} icon={<Edit />}>
            정보수정 하기
          </Button>
          <Button onClick={onClose} priority="secondary" icon={<GreenXIcon />}>
            정보수정 취소하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeNicknameModal;
