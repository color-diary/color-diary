'use client';

import { useToast } from '@/providers/toast.context';
import { clearLocalDiaries } from '@/utils/diaryLocalStorage';
import { createClient } from '@/utils/supabase/client';
import { loginZustandStore } from '@/zustand/zustandStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../common/Button';
import SignUpModal from '../signUp/SignUpModal';
import KeyIcon from './assets/KeyIcon';
import SignUpIcon from './assets/SignUpIcon';
import Vector from './assets/Vector';
import ServiceInput from '../common/ServiceInput';

interface LogInFormData {
  email: string;
  password: string;
}

const LogInForm = () => {
  const router = useRouter();
  const toast = useToast();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const setIsLogin = loginZustandStore((state) => state.setIsLogin);
  const publicSetProfileImg = loginZustandStore((state) => state.publicSetProfileImg);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>();

  const onSubmit: SubmitHandler<LogInFormData> = async (data) => {
    try {
      const response = await axios.post('/api/auth/log-in', data);
      if (response.status === 200) {
        setIsLogin(true);

        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const userId = userData.user?.id;
          const { data } = await supabase.from('users').select('profileImg, nickname').eq('id', userId).single();
          if (data && data?.profileImg) {
            publicSetProfileImg(data?.profileImg);
          }
          if (data?.nickname) {
            toast.on({ label: `${data.nickname}님 안녕하세요. 만나서 반가워요!` });
          }
        }

        clearLocalDiaries();
        router.replace('/');
      }
    } catch (error) {
      console.error(error);
      toast.on({ label: '올바른 이메일과 비밀번호를 입력해주세요' });
    }
  };

  const IsError = () => {
    if (errors.email) {
      toast.on({ label: errors.email.message || '이메일을 확인해주세요.' });
    } else if (errors.password) {
      toast.on({ label: errors.password.message || '비밀번호를 확인해주세요.' });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-744px-row inline-flex flex-col justify-center items-center rounded-5xl md:border-4 md:border-border-color bg-layout md:bg-white px-20px-row-m md:px-96px-row md:py-72px-col gap-40px-col-m md:gap-48px-col">
        <h1 className="text-font-color font-bold md:text-24px md:tracking-0.48px text-18px-m tracking-0.36px">
          로그인
        </h1>
        <form onSubmit={handleSubmit(onSubmit, IsError)} className="w-full flex flex-col items-center md:gap-72px-col gap-56px-col-m">
          <div className="flex flex-col items-start md:gap-48px-col gap-32px-col-m self-stretch">
            <div className="w-full flex flex-col items-start md:gap-24px-col gap-16px-col-m self-stretch">
              <ServiceInput
                id="email"
                type="email"
                {...register('email', { 
                  required: '이메일을 입력해주세요.', 
                  pattern: {
                    value: /^[a-zA-Z0-9]{4,10}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: '유효한 이메일 형식이 아닙니다.'
                  } 
                })}
                label="이메일"
                placeholder="이메일을 입력해주세요."
              />
              <ServiceInput
                id="password"
                type="password"
                {...register('password', { required: '비밀번호를 입력해주세요.' })}
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
              />
            </div>
            <div className="w-full flex justify-center items-center md:gap-16px-row gap-12px-row-m self-stretch">
              <Button size={'half'} icon={<KeyIcon />} type="submit">
                로그인 하기
              </Button>
              <span className="flex items-center justify-center w-6 h-6 md:w-24px-row md:h-24px-row">
                <Vector />
              </span>
              <Button size={'half'} icon={<SignUpIcon />} priority="secondary" onClick={() => setIsModalVisible(true)}>
                회원가입 하기
              </Button>
            </div>
          </div>
        </form>
      </div>
      <SignUpModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default LogInForm;
