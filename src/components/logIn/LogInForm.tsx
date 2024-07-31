"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SignUpModal from '../signUp/SignUpModal';
import { useRouter } from 'next/navigation';
import { loginZustandStore } from '@/zustand/zustandStore';
import { createClient } from '@/utils/supabase/client';
import Button from '../common/Button';
import { cn } from '@/lib/utils';
import Vector from '../common/svg/Vector';
import Key from '../common/svg/Key';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const setIsLogin = loginZustandStore(state => state.setIsLogin);
  const publicSetProfileImg = loginZustandStore(state => state.publicSetProfileImg);
  const supabase = createClient();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const clearEmail = () => setEmail('');
  const clearPassword = () => setPassword('');

  const loginHandler = async () => {
    if (!validateEmail(email)) {
      return alert('유효한 이메일 입력바람');
    }
    if (!validatePassword(password)) {
      return alert('비밀번호는 6글자 이상');
    }

    const data = { email, password };
    try {
      const response = await axios.post("/api/auth/log-in", data);
      console.log('LoginForm_response=> ', response);
      if (response.status === 200) {
        console.log(data);
        alert(response.data.message);
        setEmail('');
        setPassword('');
        setIsLogin(true);

        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const UserId = userData.user?.id;
          const { data: profileImgData } = await supabase
            .from("users")
            .select("profileImg")
            .eq('id', UserId)
            .single();
          if (profileImgData && profileImgData?.profileImg) {
            publicSetProfileImg(profileImgData?.profileImg)
          }
        }
        router.replace('/');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response)
        alert(error?.response.data.message);
      console.error(error);
      console.log('로그인 실패')
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen '>
      <div className='inline-flex flex flex-col mt-24 rounded-[32px] border-4 border-[#e6d3bc] shadow-md px-24 py-[72px]'>
        {/* 로그인 부분 */}
        <div className='pt-[72px] text-center'>
          <h1 className='font-bold'>로그인</h1>
        </div>
        {/* 이메일input */}
        <div className='flex flex-col mt-12'>
          <label htmlFor="email">이메일</label>
          <input 
            type="text" 
            placeholder='이메일을 입력해주세요'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-2 p-2 border rounded'
          />
        </div>
        {/* 비밀번호input */}
        <div className='flex flex-col mt-6'>
          <label htmlFor="password">비밀번호</label>
          <input 
            type="password" 
            placeholder='비밀번호를 입력해주세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-2 p-2 border rounded'
          />
        </div>
        {/* 로그인 버튼 */}
        <div className='flex flex-row mt-6'>
          <Button size="half" onClick={loginHandler}>로그인 하기</Button>
          <Vector />
          <Button size="half" onClick={()=> setIsModalVisible(true)}>회원가입 하기</Button>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
