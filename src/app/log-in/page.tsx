"use client";
import axios from 'axios';
import React, { useState } from 'react';

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const clearEmail = () => setEmail('');
  const clearPassword = () => setPassword('');

  const loginHandler = async () => {
    const data = { email, password };

    try {
      const response = await axios.post("/api/auth/log-in", data);
      if (response.status === 200) {
        alert('로그인 성공');
        console.log('로그인 성공');
        console.log(data);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      alert('로그인 실패');
      console.log('로그인 실패');
    }
  };

  const logoutHandler = async () => {
    const response = await axios.delete("/api/auth/log-out");
    if (response.status === 200) {
      alert('로그아웃 성공');
      console.log('로그아웃 성공');
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[30px]"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[30px]"
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
          >
            회원가입하기
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={logoutHandler}
            className="text-[#000000] bg-[#CECECE] rounded px-6 py-3 text-lg absolute top-[220px] left-[700px]"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
