'use client';

import useAuth from '@/hooks/useAuth';
import { useToast } from '@/providers/toast.context';
import { clearLocalDiaries } from '@/utils/diaryLocalStorage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../common/Button';
import ServiceInput from '../common/ServiceInput';
import SignUpModal from '../signUp/SignUpModal';
import KeyIcon from './assets/KeyIcon';
import SignUpIcon from './assets/SignUpIcon';
import Vector from './assets/Vector';

interface LogInFormData {
  email: string;
  password: string;
}

const LogInForm = () => {
  const router = useRouter();
  const toast = useToast();

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mutate: logIn } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post('/api/auth/log-in', { email: data.email, password: data.password });

      toast.on({ label: `${response.data[0].nickname}님 안녕하세요. 만나서 반가워요!` });
    },
    onSuccess: () => {
      clearLocalDiaries();

      router.replace('/');

      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['information'] });
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['main'] });
    },
    onError: (error) => {
      console.error('로그인 실패: ', error);
      toast.on({ label: '올바른 이메일과 비밀번호를 입력해주세요' });
    }
  });

  useEffect(() => {
    const checkSession = (): void => {
      if (user) router.replace('/');
    };

    checkSession();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LogInFormData>();

  const onSubmit: SubmitHandler<LogInFormData> = async (data) => {
    logIn(data);
  };

  const handleError = (): void => {
    if (errors.email) {
      toast.on({ label: errors.email.message || '이메일을 확인해주세요.' });
    } else if (errors.password) {
      toast.on({ label: errors.password.message || '비밀번호를 확인해주세요.' });
    }
  };

  return (
    <div className="h-h-screen-custom md:h-screen flex justify-center items-center">
      <div className="w-full md:w-744px-row inline-flex flex-col justify-center items-center rounded-5xl md:border-4 md:border-border-color bg-layout md:bg-white px-20px-row-m md:px-96px-row md:py-72px-col gap-40px-col-m md:gap-48px-col">
        <h1 className="text-font-color font-bold md:text-24px md:tracking-0.48px text-18px-m tracking-0.36px">
          로그인
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="w-full flex flex-col items-center md:gap-72px-col gap-56px-col-m"
        >
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
                {...register('password', {
                  required: '비밀번호를 입력해주세요.'
                })}
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
              <Button
                size={'half'}
                icon={<SignUpIcon />}
                priority="secondary"
                onClick={() => setIsModalVisible(true)}
                type="button"
              >
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
