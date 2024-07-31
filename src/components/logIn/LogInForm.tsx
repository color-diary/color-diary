"use client";
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginZustandStore } from '@/zustand/zustandStore';
import { createClient } from '@/utils/supabase/client';
import Button from '../common/Button';
import Vector from '../common/svg/Vector';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const setIsLogin = loginZustandStore(state => state.setIsLogin);
  const publicSetProfileImg = loginZustandStore(state => state.publicSetProfileImg);
  const supabase = createClient();

  const clearEmail = () => setEmail('');
  const clearPassword = () => setPassword('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

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
      <div className='inline-flex flex-col mt-24 rounded-[32px] border-4 border-[#e6d3bc] shadow-md px-8 py-12 lg:px-24 lg:py-[72px]'>
        {/* 로그인 부분 */}
        <div className='text-center mb-12'>
          <h1 className='font-bold text-2xl'>로그인</h1>
        </div>
        {/* 이메일 input */}
        <div className='flex flex-col text-xl relative'>
          <label htmlFor="email" className='font-bold'>이메일</label>
          <input 
            type="text" 
            placeholder='이메일을 입력해주세요.'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-2 px-4 py-3 lg:min-w-[560px] border-black border rounded-md'
          />
          {email && (
            <button
              onClick={clearEmail}
              className="absolute right-[10px] bottom-[2px] transform -translate-y-1/2 text-[#CECECE] text-[30px]"
            >
              &times;
            </button>
          )}
        </div>
        {/* 비밀번호 input */}
        <div className='flex flex-col mt-6 text-xl relative'>
          <label htmlFor="password" className='font-bold'>비밀번호</label>
          <input 
            type="password" 
            placeholder='비밀번호를 입력해주세요.'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-2 px-4 py-3 lg:min-w-[560px] border-black border rounded-md'
          />
          {password && (
            <button
              onClick={clearPassword}
              className="absolute right-[10px] bottom-[2px] transform -translate-y-1/2 text-[#CECECE] text-[30px]"
            >
              &times;
            </button>
          )}
        </div>
        {/* 로그인, 회원가입 버튼 */}
        <div className='flex flex-row mt-12'>
          <Button size="half" onClick={loginHandler}>로그인 하기</Button>
          <div className='px-[28px]'>
            <Vector/>
          </div>
          <Button priority="secondary" size="half" onClick={()=> setIsModalVisible(true)}>회원가입 하기</Button>
        </div>
        {/* 아이콘 */}
        <div className="flex justify-center gap-8 mt-[72px]">
          <div className="flex justify-center">
            <div className="w-[44px] h-[44px] rounded-full flex justify-center items-center">
              <img src="/Apple.png" alt="Apple" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[44px] h-[44px] rounded-full flex justify-center items-center">
              <img src="/Google.png" alt="Google" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[44px] h-[44px] rounded-full flex justify-center items-center">
              <img src="/Kakao.png" alt="Kakao" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[44px] h-[44px] rounded-full flex justify-center items-center">
              <img src="/Naver.png" alt="Naver" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
