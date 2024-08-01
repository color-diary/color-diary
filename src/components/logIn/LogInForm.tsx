"use client";
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginZustandStore } from '@/zustand/zustandStore';
import { createClient } from '@/utils/supabase/client';
import SignUpModal from '../signUp/SignUpModal';
import Button from '../common/Button';

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
      <div className='inline-flex flex-col rounded-[32px] border-4 border-[#e6d3bc] shadow-md px-8 py-12 lg:px-24 lg:py-[72px]'>
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
          <Button icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6C15 6.26522 14.8946 6.51957 14.7071 6.70711C14.5196 6.89464 14.2652 7 14 7C13.7348 7 13.4804 6.89464 13.2929 6.70711C13.1054 6.51957 13 6.26522 13 6C13 5.73478 13.1054 5.48043 13.2929 5.29289C13.4804 5.10536 13.7348 5 14 5C14.2652 5 14.5196 5.10536 14.7071 5.29289C14.8946 5.48043 15 5.73478 15 6ZM12.5 2C9.424 2 7 4.424 7 7.5C7 7.897 7.04 8.296 7.122 8.675C7.18 8.945 7.114 9.179 6.98 9.313L2.44 13.853C2.30043 13.9924 2.18973 14.1579 2.11423 14.3402C2.03873 14.5224 1.99991 14.7177 2 14.915V16.5C2 16.8978 2.15804 17.2794 2.43934 17.5607C2.72064 17.842 3.10218 18 3.5 18H5.5C5.89783 18 6.27936 17.842 6.56066 17.5607C6.84196 17.2794 7 16.8978 7 16.5V16H8C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V14H10C10.2652 14 10.5196 13.8946 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13V12.82C11.493 12.954 12.007 13 12.5 13C15.576 13 18 10.576 18 7.5C18 4.424 15.576 2 12.5 2ZM8 7.5C8 4.976 9.976 3 12.5 3C15.024 3 17 4.976 17 7.5C17 10.024 15.024 12 12.5 12C11.84 12 11.227 11.905 10.724 11.653C10.6478 11.6148 10.563 11.5967 10.4779 11.6005C10.3927 11.6043 10.3099 11.6298 10.2373 11.6746C10.1648 11.7194 10.1049 11.782 10.0633 11.8564C10.0218 11.9309 10 12.0147 10 12.1V13H9C8.73478 13 8.48043 13.1054 8.29289 13.2929C8.10536 13.4804 8 13.7348 8 14V15H7C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16V16.5C6 16.6326 5.94732 16.7598 5.85355 16.8536C5.75979 16.9473 5.63261 17 5.5 17H3.5C3.36739 17 3.24022 16.9473 3.14645 16.8536C3.05268 16.7598 3 16.6326 3 16.5V14.914C3.00003 14.7816 3.05253 14.6547 3.146 14.561L7.687 10.02C8.119 9.588 8.209 8.976 8.099 8.464C8.03215 8.14705 7.99897 7.82392 8 7.5Z" fill="white" />
          </svg>
          } size="half" onClick={loginHandler}>로그인 하기</Button>
          <div className='px-[28px] mt-3'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4 3.60001C11.5592 3.60001 11.7118 3.66322 11.8243 3.77574C11.9368 3.88826 12 4.04088 12 4.20001V19.8C12 19.9591 11.9368 20.1117 11.8243 20.2243C11.7118 20.3368 11.5592 20.4 11.4 20.4C11.2409 20.4 11.0883 20.3368 10.9758 20.2243C10.8633 20.1117 10.8 19.9591 10.8 19.8V4.20001C10.8 4.04088 10.8633 3.88826 10.9758 3.77574C11.0883 3.66322 11.2409 3.60001 11.4 3.60001Z" fill="#080808" />
              <path d="M11.4 3.60001C11.5592 3.60001 11.7118 3.66322 11.8243 3.77574C11.9368 3.88826 12 4.04088 12 4.20001V19.8C12 19.9591 11.9368 20.1117 11.8243 20.2243C11.7118 20.3368 11.5592 20.4 11.4 20.4C11.2409 20.4 11.0883 20.3368 10.9758 20.2243C10.8633 20.1117 10.8 19.9591 10.8 19.8V4.20001C10.8 4.04088 10.8633 3.88826 10.9758 3.77574C11.0883 3.66322 11.2409 3.60001 11.4 3.60001Z" fill="black" fillOpacity="0.2" />
              <path d="M11.4 3.60001C11.5592 3.60001 11.7118 3.66322 11.8243 3.77574C11.9368 3.88826 12 4.04088 12 4.20001V19.8C12 19.9591 11.9368 20.1117 11.8243 20.2243C11.7118 20.3368 11.5592 20.4 11.4 20.4C11.2409 20.4 11.0883 20.3368 10.9758 20.2243C10.8633 20.1117 10.8 19.9591 10.8 19.8V4.20001C10.8 4.04088 10.8633 3.88826 10.9758 3.77574C11.0883 3.66322 11.2409 3.60001 11.4 3.60001Z" fill="black" fillOpacity="0.2" />
              <path d="M11.4 3.60001C11.5592 3.60001 11.7118 3.66322 11.8243 3.77574C11.9368 3.88826 12 4.04088 12 4.20001V19.8C12 19.9591 11.9368 20.1117 11.8243 20.2243C11.7118 20.3368 11.5592 20.4 11.4 20.4C11.2409 20.4 11.0883 20.3368 10.9758 20.2243C10.8633 20.1117 10.8 19.9591 10.8 19.8V4.20001C10.8 4.04088 10.8633 3.88826 10.9758 3.77574C11.0883 3.66322 11.2409 3.60001 11.4 3.60001Z" fill="black" fillOpacity="0.2" />
              <path d="M11.4 3.60001C11.5592 3.60001 11.7118 3.66322 11.8243 3.77574C11.9368 3.88826 12 4.04088 12 4.20001V19.8C12 19.9591 11.9368 20.1117 11.8243 20.2243C11.7118 20.3368 11.5592 20.4 11.4 20.4C11.2409 20.4 11.0883 20.3368 10.9758 20.2243C10.8633 20.1117 10.8 19.9591 10.8 19.8V4.20001C10.8 4.04088 10.8633 3.88826 10.9758 3.77574C11.0883 3.66322 11.2409 3.60001 11.4 3.60001Z" fill="black" fillOpacity="0.2" />
              <path d="M11.4 3.60001C11.5592 3.60001 11.7118 3.66322 11.8243 3.77574C11.9368 3.88826 12 4.04088 12 4.20001V19.8C12 19.9591 11.9368 20.1117 11.8243 20.2243C11.7118 20.3368 11.5592 20.4 11.4 20.4C11.2409 20.4 11.0883 20.3368 10.9758 20.2243C10.8633 20.1117 10.8 19.9591 10.8 19.8V4.20001C10.8 4.04088 10.8633 3.88826 10.9758 3.77574C11.0883 3.66322 11.2409 3.60001 11.4 3.60001Z" fill="black" fillOpacity="0.2" />
            </svg>

          </div>
          <Button icon={<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 2C8.43913 2 7.42172 2.42143 6.67157 3.17157C5.92143 3.92172 5.5 4.93913 5.5 6C5.5 7.06087 5.92143 8.07828 6.67157 8.82843C7.42172 9.57857 8.43913 10 9.5 10C10.5609 10 11.5783 9.57857 12.3284 8.82843C13.0786 8.07828 13.5 7.06087 13.5 6C13.5 4.93913 13.0786 3.92172 12.3284 3.17157C11.5783 2.42143 10.5609 2 9.5 2ZM6.5 6C6.5 5.20435 6.81607 4.44129 7.37868 3.87868C7.94129 3.31607 8.70435 3 9.5 3C10.2956 3 11.0587 3.31607 11.6213 3.87868C12.1839 4.44129 12.5 5.20435 12.5 6C12.5 6.79565 12.1839 7.55871 11.6213 8.12132C11.0587 8.68393 10.2956 9 9.5 9C8.70435 9 7.94129 8.68393 7.37868 8.12132C6.81607 7.55871 6.5 6.79565 6.5 6ZM4.509 11C4.2456 10.9988 3.98456 11.0497 3.74087 11.1496C3.49718 11.2496 3.27564 11.3968 3.08896 11.5826C2.90229 11.7684 2.75417 11.9893 2.6531 12.2325C2.55203 12.4758 2.5 12.7366 2.5 13C2.5 14.691 3.333 15.966 4.635 16.797C5.917 17.614 7.645 18 9.5 18C9.91133 18 10.3147 17.981 10.71 17.943C10.4714 17.6459 10.2643 17.3249 10.092 16.985C9.898 16.995 9.70067 17 9.5 17C7.765 17 6.243 16.636 5.173 15.953C4.123 15.283 3.5 14.31 3.5 13C3.5 12.447 3.948 12 4.509 12H10.099C10.2837 11.6413 10.503 11.308 10.757 11H4.509ZM15 19C16.1935 19 17.3381 18.5259 18.182 17.682C19.0259 16.8381 19.5 15.6935 19.5 14.5C19.5 13.3065 19.0259 12.1619 18.182 11.318C17.3381 10.4741 16.1935 10 15 10C13.8065 10 12.6619 10.4741 11.818 11.318C10.9741 12.1619 10.5 13.3065 10.5 14.5C10.5 15.6935 10.9741 16.8381 11.818 17.682C12.6619 18.5259 13.8065 19 15 19ZM15 12C15.1326 12 15.2598 12.0527 15.3536 12.1464C15.4473 12.2402 15.5 12.3674 15.5 12.5V14H17C17.1326 14 17.2598 14.0527 17.3536 14.1464C17.4473 14.2402 17.5 14.3674 17.5 14.5C17.5 14.6326 17.4473 14.7598 17.3536 14.8536C17.2598 14.9473 17.1326 15 17 15H15.5V16.5C15.5 16.6326 15.4473 16.7598 15.3536 16.8536C15.2598 16.9473 15.1326 17 15 17C14.8674 17 14.7402 16.9473 14.6464 16.8536C14.5527 16.7598 14.5 16.6326 14.5 16.5V15H13C12.8674 15 12.7402 14.9473 12.6464 14.8536C12.5527 14.7598 12.5 14.6326 12.5 14.5C12.5 14.3674 12.5527 14.2402 12.6464 14.1464C12.7402 14.0527 12.8674 14 13 14H14.5V12.5C14.5 12.3674 14.5527 12.2402 14.6464 12.1464C14.7402 12.0527 14.8674 12 15 12Z" fill="#25B18C" />
          </svg>
          } priority="secondary" size="half" onClick={() => setIsModalVisible(true)}>회원가입 하기</Button>
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
      <SignUpModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default LogInForm;
