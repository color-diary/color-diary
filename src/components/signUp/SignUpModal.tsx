'use client';

import { clearLocalDiaries, fetchLocalDiaries } from '@/utils/diaryLocalStorage';
import { urlToFile } from '@/utils/imageFileUtils';
import axios from 'axios';
import { useState } from 'react';
import Input from '../common/Input';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      return alert('유효한 이메일 입력바람');
    }

    if (!validateNickname(nickname)) {
      return alert('닉네임은 최소3글자 이상');
    }

    if (!validatePassword(password)) {
      return alert('비밀번호는 6글자 이상');
    }

    if (password !== confirmPassword) {
      return alert('비밀번호가 일치하지않음');
    }

    const data = { email, password, nickname };
    try {
      const response = await axios.post('/api/auth/sign-up', data);

      if (response.status === 200) {
        alert('가입 성공');

        setEmail('');
        setPassword('');
        setNickname('');
        setConfirmPassword('');
        onClose();

        const savedDiaries = fetchLocalDiaries();

        if (savedDiaries.length) {
          savedDiaries.forEach(async (diary) => {
            const formData = new FormData();
            formData.append('userId', response.data.userData.user.id);
            formData.append('color', diary.color);
            formData.append('tags', JSON.stringify(diary.tags));
            formData.append('content', diary.content);
            formData.append('date', new Date(diary.date).toISOString());

            if (diary.img) {
              const file = await urlToFile(diary.img);
              formData.append('img', file);
            } else {
              formData.append('img', '');
            }

            await axios.post('/api/diaries', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          });

          clearLocalDiaries();
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error?.response.data.message);
      }
      console.error(error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center items-center bg-backdrop">
      <div className="bg-sign-up pt-36px-col px-96px-row rounded-5xl border-4 border-border-color">
        <button className="text-black text-[30px]" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.9068 5.0592L4.9752 4.9752C5.07463 4.87599 5.20571 4.81481 5.34561 4.80231C5.48551 4.78981 5.62536 4.82679 5.7408 4.9068L5.8248 4.9752L12 11.1516L18.1752 4.9752C18.2746 4.87599 18.4057 4.81481 18.5456 4.80231C18.6855 4.78981 18.8254 4.82679 18.9408 4.9068L19.0248 4.9752C19.124 5.07463 19.1852 5.20571 19.1977 5.34561C19.2102 5.48551 19.1732 5.62536 19.0932 5.7408L19.0248 5.8248L12.8484 12L19.0248 18.1752C19.124 18.2746 19.1852 18.4057 19.1977 18.5456C19.2102 18.6855 19.1732 18.8254 19.0932 18.9408L19.0248 19.0248C18.9254 19.124 18.7943 19.1852 18.6544 19.1977C18.5145 19.2102 18.3746 19.1732 18.2592 19.0932L18.1752 19.0248L12 12.8484L5.8248 19.0248C5.72537 19.124 5.59429 19.1852 5.45439 19.1977C5.31449 19.2102 5.17464 19.1732 5.0592 19.0932L4.9752 19.0248C4.87599 18.9254 4.81481 18.7943 4.80231 18.6544C4.78981 18.5145 4.82679 18.3746 4.9068 18.2592L4.9752 18.1752L11.1516 12L4.9752 5.8248C4.87599 5.72537 4.81481 5.59429 4.80231 5.45439C4.78981 5.31449 4.82679 5.17464 4.9068 5.0592Z"
              fill="#080808"
            />
            <path
              d="M4.9068 5.0592L4.9752 4.9752C5.07463 4.87599 5.20571 4.81481 5.34561 4.80231C5.48551 4.78981 5.62536 4.82679 5.7408 4.9068L5.8248 4.9752L12 11.1516L18.1752 4.9752C18.2746 4.87599 18.4057 4.81481 18.5456 4.80231C18.6855 4.78981 18.8254 4.82679 18.9408 4.9068L19.0248 4.9752C19.124 5.07463 19.1852 5.20571 19.1977 5.34561C19.2102 5.48551 19.1732 5.62536 19.0932 5.7408L19.0248 5.8248L12.8484 12L19.0248 18.1752C19.124 18.2746 19.1852 18.4057 19.1977 18.5456C19.2102 18.6855 19.1732 18.8254 19.0932 18.9408L19.0248 19.0248C18.9254 19.124 18.7943 19.1852 18.6544 19.1977C18.5145 19.2102 18.3746 19.1732 18.2592 19.0932L18.1752 19.0248L12 12.8484L5.8248 19.0248C5.72537 19.124 5.59429 19.1852 5.45439 19.1977C5.31449 19.2102 5.17464 19.1732 5.0592 19.0932L4.9752 19.0248C4.87599 18.9254 4.81481 18.7943 4.80231 18.6544C4.78981 18.5145 4.82679 18.3746 4.9068 18.2592L4.9752 18.1752L11.1516 12L4.9752 5.8248C4.87599 5.72537 4.81481 5.59429 4.80231 5.45439C4.78981 5.31449 4.82679 5.17464 4.9068 5.0592Z"
              fill="black"
              fillOpacity="0.2"
            />
            <path
              d="M4.9068 5.0592L4.9752 4.9752C5.07463 4.87599 5.20571 4.81481 5.34561 4.80231C5.48551 4.78981 5.62536 4.82679 5.7408 4.9068L5.8248 4.9752L12 11.1516L18.1752 4.9752C18.2746 4.87599 18.4057 4.81481 18.5456 4.80231C18.6855 4.78981 18.8254 4.82679 18.9408 4.9068L19.0248 4.9752C19.124 5.07463 19.1852 5.20571 19.1977 5.34561C19.2102 5.48551 19.1732 5.62536 19.0932 5.7408L19.0248 5.8248L12.8484 12L19.0248 18.1752C19.124 18.2746 19.1852 18.4057 19.1977 18.5456C19.2102 18.6855 19.1732 18.8254 19.0932 18.9408L19.0248 19.0248C18.9254 19.124 18.7943 19.1852 18.6544 19.1977C18.5145 19.2102 18.3746 19.1732 18.2592 19.0932L18.1752 19.0248L12 12.8484L5.8248 19.0248C5.72537 19.124 5.59429 19.1852 5.45439 19.1977C5.31449 19.2102 5.17464 19.1732 5.0592 19.0932L4.9752 19.0248C4.87599 18.9254 4.81481 18.7943 4.80231 18.6544C4.78981 18.5145 4.82679 18.3746 4.9068 18.2592L4.9752 18.1752L11.1516 12L4.9752 5.8248C4.87599 5.72537 4.81481 5.59429 4.80231 5.45439C4.78981 5.31449 4.82679 5.17464 4.9068 5.0592Z"
              fill="black"
              fillOpacity="0.2"
            />
            <path
              d="M4.9068 5.0592L4.9752 4.9752C5.07463 4.87599 5.20571 4.81481 5.34561 4.80231C5.48551 4.78981 5.62536 4.82679 5.7408 4.9068L5.8248 4.9752L12 11.1516L18.1752 4.9752C18.2746 4.87599 18.4057 4.81481 18.5456 4.80231C18.6855 4.78981 18.8254 4.82679 18.9408 4.9068L19.0248 4.9752C19.124 5.07463 19.1852 5.20571 19.1977 5.34561C19.2102 5.48551 19.1732 5.62536 19.0932 5.7408L19.0248 5.8248L12.8484 12L19.0248 18.1752C19.124 18.2746 19.1852 18.4057 19.1977 18.5456C19.2102 18.6855 19.1732 18.8254 19.0932 18.9408L19.0248 19.0248C18.9254 19.124 18.7943 19.1852 18.6544 19.1977C18.5145 19.2102 18.3746 19.1732 18.2592 19.0932L18.1752 19.0248L12 12.8484L5.8248 19.0248C5.72537 19.124 5.59429 19.1852 5.45439 19.1977C5.31449 19.2102 5.17464 19.1732 5.0592 19.0932L4.9752 19.0248C4.87599 18.9254 4.81481 18.7943 4.80231 18.6544C4.78981 18.5145 4.82679 18.3746 4.9068 18.2592L4.9752 18.1752L11.1516 12L4.9752 5.8248C4.87599 5.72537 4.81481 5.59429 4.80231 5.45439C4.78981 5.31449 4.82679 5.17464 4.9068 5.0592Z"
              fill="black"
              fillOpacity="0.2"
            />
            <path
              d="M4.9068 5.0592L4.9752 4.9752C5.07463 4.87599 5.20571 4.81481 5.34561 4.80231C5.48551 4.78981 5.62536 4.82679 5.7408 4.9068L5.8248 4.9752L12 11.1516L18.1752 4.9752C18.2746 4.87599 18.4057 4.81481 18.5456 4.80231C18.6855 4.78981 18.8254 4.82679 18.9408 4.9068L19.0248 4.9752C19.124 5.07463 19.1852 5.20571 19.1977 5.34561C19.2102 5.48551 19.1732 5.62536 19.0932 5.7408L19.0248 5.8248L12.8484 12L19.0248 18.1752C19.124 18.2746 19.1852 18.4057 19.1977 18.5456C19.2102 18.6855 19.1732 18.8254 19.0932 18.9408L19.0248 19.0248C18.9254 19.124 18.7943 19.1852 18.6544 19.1977C18.5145 19.2102 18.3746 19.1732 18.2592 19.0932L18.1752 19.0248L12 12.8484L5.8248 19.0248C5.72537 19.124 5.59429 19.1852 5.45439 19.1977C5.31449 19.2102 5.17464 19.1732 5.0592 19.0932L4.9752 19.0248C4.87599 18.9254 4.81481 18.7943 4.80231 18.6544C4.78981 18.5145 4.82679 18.3746 4.9068 18.2592L4.9752 18.1752L11.1516 12L4.9752 5.8248C4.87599 5.72537 4.81481 5.59429 4.80231 5.45439C4.78981 5.31449 4.82679 5.17464 4.9068 5.0592Z"
              fill="black"
              fillOpacity="0.2"
            />
            <path
              d="M4.9068 5.0592L4.9752 4.9752C5.07463 4.87599 5.20571 4.81481 5.34561 4.80231C5.48551 4.78981 5.62536 4.82679 5.7408 4.9068L5.8248 4.9752L12 11.1516L18.1752 4.9752C18.2746 4.87599 18.4057 4.81481 18.5456 4.80231C18.6855 4.78981 18.8254 4.82679 18.9408 4.9068L19.0248 4.9752C19.124 5.07463 19.1852 5.20571 19.1977 5.34561C19.2102 5.48551 19.1732 5.62536 19.0932 5.7408L19.0248 5.8248L12.8484 12L19.0248 18.1752C19.124 18.2746 19.1852 18.4057 19.1977 18.5456C19.2102 18.6855 19.1732 18.8254 19.0932 18.9408L19.0248 19.0248C18.9254 19.124 18.7943 19.1852 18.6544 19.1977C18.5145 19.2102 18.3746 19.1732 18.2592 19.0932L18.1752 19.0248L12 12.8484L5.8248 19.0248C5.72537 19.124 5.59429 19.1852 5.45439 19.1977C5.31449 19.2102 5.17464 19.1732 5.0592 19.0932L4.9752 19.0248C4.87599 18.9254 4.81481 18.7943 4.80231 18.6544C4.78981 18.5145 4.82679 18.3746 4.9068 18.2592L4.9752 18.1752L11.1516 12L4.9752 5.8248C4.87599 5.72537 4.81481 5.59429 4.80231 5.45439C4.78981 5.31449 4.82679 5.17464 4.9068 5.0592Z"
              fill="black"
              fillOpacity="0.2"
            />
          </svg>
        </button>
        <h2 className="text-[20px] font-bold mb-[30px] text-center">회원가입</h2>
        <div className="w-full flex flex-col gap-16px-col items-center self-stretch">
          <Input
            type="email"
            state={'filled'}
            value={email}
            setValue={setEmail}
            onChange={(e) => setEmail(e.target.value)}
            label="이메일"
            validationMessage="ex)abcd@gmail.com"
            placeholder="이메일을 입력해주세요"
          />
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
          <button
            className="h-[40px] px-3 py-1 mt-[40px] text-[#000000] bg-[#CECECE] rounded font-bold text-[15px]"
            onClick={signUpHandler}
          >
            회원가입 완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
