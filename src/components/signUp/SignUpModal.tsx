"use client";
import axios from 'axios';
import React, { ReactNode, useState } from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

    // 이메일, 비밀번호 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // .test => emailRegex과 패턴이 일치하는지 검사
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateNickname = (nickname: string) => {
    return nickname.length >= 3;
  };

  const signUpHandler = async () => {

    if (!validateEmail(email)) {
      return alert('유효한 이메일 입력바람')
    }

    if (!validateNickname(nickname)) {
      return alert('닉네임은 최소3글자 이상')
    }

    if (!validatePassword(password)) {
      return alert('비밀번호는 6글자 이상')
    }

    if (password !== confirmPassword) {
      return alert('비밀번호가 일치하지않음')
    }

    const data = { email, password, nickname };
    try {
      const response = await axios.post("/api/auth/sign-up", data);
      console.log('SignUp_Form_response=> ', response);
      if (response.status === 200) {
        alert('가입 성공');
        console.log('가입 성공')
        console.log(data);
        setEmail('');
        setPassword('');
        setNickname('');
        setConfirmPassword('');
        onClose();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error?.response.data.message);
      }
      console.error(error);
      console.log('가입 실패')
    }
  }

  // 모달이 보이지 않을 때 모달 컴포넌트 렌더링 방지
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center ">
      <div className="bg-[#E6E6E6] p-8 rounded-[30px] shadow-lg w-[700px] h-[800px] relative ">
        <button
          className="absolute top-1 right-5 text-black text-[30px]"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-[20px] font-bold mb-[30px] text-center">회원가입</h2>
        <div className="mb-4 flex justify-center">
          <div className="w-[500px]">
            <label className="block text-[#000000] font-bold text-[20px] mb-[5px]">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              className="w-full px-3 py-2 border border-black rounded"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <div className="w-[500px]">
            <label className="block text-[#000000] font-bold text-[20px] mb-[5px]">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요."
              className="w-full px-3 py-2 border border-black rounded"
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
            />
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <div className="w-[500px]">
            <label className="block text-[#000000] font-bold text-[20px] mb-[5px]">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className="w-full px-3 py-2 border border-black rounded"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <div className="w-[500px]">
            <label className="block text-[#000000] font-bold text-[20px] mb-[5px]">비밀번호 확인하기</label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              className="w-full px-3 py-2 border border-black rounded"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          <div className="w-[500px]">
            <button className="h-[40px] px-3 py-1 mt-[35px] text-[#000000] bg-[#CECECE] rounded font-bold text-[15px]">
              이용약관 확인하기 &gt;
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-[20px] ml-[100px] mt-[40px]">
          <button className="h-[40px] px-3 py-1 mt-[40px] text-[#000000] bg-[#CECECE] rounded font-bold text-[15px]">
            홈으로 돌아가기
          </button>
          <button className="h-[40px] px-3 py-1 mt-[40px] text-[#000000] bg-[#CECECE] rounded font-bold text-[15px]" onClick={signUpHandler}>
            회원가입 완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;