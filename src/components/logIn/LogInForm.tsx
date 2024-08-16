'use client';

import useAuth from '@/hooks/useAuth';
import { useToast } from '@/providers/toast.context';
import { clearLocalDiaries } from '@/utils/diaryLocalStorage';
import { loginZustandStore } from '@/zustand/zustandStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { notFound, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import SignUpModal from '../signUp/SignUpModal';
import KeyIcon from './assets/KeyIcon';
import SignUpIcon from './assets/SignUpIcon';
import Vector from './assets/Vector';

const LogInForm = () => {
  const router = useRouter();
  const toast = useToast();

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const setIsLogin = loginZustandStore((state) => state.setIsLogin);

  const { mutate: logIn } = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/auth/log-in', { email, password });

      toast.on({ label: `${response.data[0].nickname}님 안녕하세요. 만나서 반가워요!` });
    },
    onSuccess: () => {
      setEmail('');
      setPassword('');
      setIsLogin(true);

      clearLocalDiaries();
      router.replace('/');

      queryClient.refetchQueries({ queryKey: ['user'] });
      queryClient.refetchQueries({ queryKey: ['information'] });

      queryClient.invalidateQueries({ queryKey: ['diaries', 'main'] });
    },
    onError: (error) => {
      console.error('로그인 실패: ', error);
      toast.on({ label: '올바른 이메일과 비밀번호를 입력해주세요' });
    }
  });

  const handleClickLogIn = (): void => {
    if (!email || !password) return toast.on({ label: '이메일과 비밀번호를 작성해주세요.' });

    logIn();
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  if (user) {
    return notFound();
  }

  return (
    <div className="h-h-screen-custom md:h-screen flex justify-center items-center">
      <div className="w-full md:w-744px-row inline-flex flex-col justify-center items-center rounded-5xl md:border-4 md:border-border-color bg-layout md:bg-white px-20px-row-m md:px-96px-row md:py-72px-col gap-40px-col-m md:gap-48px-col">
        <h1 className="text-font-color font-bold md:text-24px md:tracking-0.48px text-18px-m tracking-0.36px">
          로그인
        </h1>
        <div className="w-full flex flex-col items-center md:gap-72px-col gap-56px-col-m">
          <div className="flex flex-col items-start md:gap-48px-col gap-32px-col-m self-stretch">
            <div className="w-full flex flex-col items-start md:gap-24px-col gap-16px-col-m self-stretch">
              <Input
                id="email"
                type="email"
                value={email}
                setValue={setEmail}
                onChange={handleChangeEmail}
                label="이메일"
                placeholder="이메일을 입력해주세요."
              />
              <Input
                id="password"
                type="password"
                value={password}
                setValue={setPassword}
                onChange={handleChangePassword}
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
              />
            </div>
            <div className="w-full flex justify-center items-center md:gap-16px-row gap-12px-row-m self-stretch">
              <Button size={'half'} icon={<KeyIcon />} onClick={handleClickLogIn}>
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
        </div>
      </div>
      <SignUpModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default LogInForm;
