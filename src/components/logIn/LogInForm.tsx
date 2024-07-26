"use client";
import axios from 'axios';
import React, { useState } from 'react';
import SignUpModal from '../signUp/SignUpModal';
import Router from 'next/router';
import { useRouter } from 'next/navigation';
import { loginZustandStore } from '@/zustand/zustandStore';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const setIsLogin = loginZustandStore(state => state.setIsLogin);

  // 이메일, 비밀번호 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // .test => emailRegex과 패턴이 일치하는지 검사
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const clearEmail = () => setEmail('');
  const clearPassword = () => setPassword('');

  const loginHandler = async () => {

    if (!validateEmail(email)) {
      return alert('유효한 이메일 입력바람')
    }

    if (!validatePassword(password)) {
      return alert('비밀번호는 6글자 이상')
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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-[700px] h-[550px] p-[60px] bg-[#E6E6E6] rounded-[30px] shadow-md">
        <h2 className="text-2xl font-bold mb-[40px] text-center">로그인</h2>
        <div className="mb-4 relative">
          <label className="block text-[#000000] font-bold text-[20px] mb-[5px]">이메일</label>
          <div className="relative">
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded"
            />
            {email && (
              <button
                onClick={clearEmail}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CECECE] text-[30px]"
              >
                &times;
              </button>
            )}
          </div>
        </div>
        <div className="mb-4 relative">
          <label className="block text-[#000000] font-bold text-[20px] mb-[5px]">비밀번호</label>
          <div className="relative">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded"
            />
            {password && (
              <button
                onClick={clearPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CECECE] text-[30px]"
              >
                &times;
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-[40px]">
          <button
            onClick={loginHandler}
            className="px-6 py-3 text-[#000000] bg-[#CECECE] rounded w-[250px] font-[700] text-lg"
          >
            로그인하기
          </button>
          <span className="text-lg">|</span>
          <button
            className="px-6 py-3 text-[#000000] bg-[#CECECE] rounded w-[250px] font-[700] text-lg"
            onClick={() => setIsModalVisible(true)}
          >
            회원가입하기
          </button>
        </div>
      </div>
      <SignUpModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default LogInForm;
