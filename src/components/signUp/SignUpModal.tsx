'use client';

import { useToast } from '@/providers/toast.context';
import { InputStateType } from '@/types/input.type';
import { clearLocalDiaries, fetchLocalDiaries } from '@/utils/diaryLocalStorage';
import { urlToFile } from '@/utils/imageFileUtils';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';
import BackDrop from '../common/BackDrop';
import Button from '../common/Button';
import Input from '../common/Input';
import TermsModal from './TermsModal';
import AngleRightBlue from './assets/AngleRightBlue';
import CheckFalse from './assets/CheckFalse';
import CheckTrue from './assets/CheckTrue';
import SignUpIcon from './assets/SignUpIcon';
import XIconBlack from './assets/XIconBlack';
import XIconGreen from './assets/XIconGreen';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isVisible, onClose }: ModalProps) => {
  const toast = useToast();

  const [email, setEmail] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isOpenTerms, setIsOpenTerms] = useState<boolean>(false);
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [emailState, setEmailState] = useState<InputStateType>('default');
  const [nicknameState, setNicknameState] = useState<InputStateType>('default');
  const [passwordState, setPasswordState] = useState<InputStateType>('default');
  const [confirmPasswordState, setConfirmPasswordState] = useState<InputStateType>('default');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const validateNicknameNull = (nickname: string): boolean => {
    return nickname !== null && nickname !== undefined && nickname.trim() !== '';
  };

  const validateNickname = (nickname: string): boolean => {
    return nickname.length >= 3 && nickname.length <= 8;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };

  const handleClickSignUp = async (): Promise<void> => {
    if (!validateEmail(email)) {
      return toast.on({ label: '이메일을 작성하지 않으셨어요. 이메일을 작성해주세요.' });
    }

    if (!validateNicknameNull(nickname)) {
      return toast.on({ label: '이름을 작성하지 않으셨어요. 이름을 작성해주세요.' });
    }

    if (!validateNickname(nickname)) {
      return toast.on({ label: '이름은 3~8글자 이내로 작성해주세요.' });
    }

    if (!validatePassword(password)) {
      return toast.on({ label: '비밀번호를 작성하지 않으셨어요. 비밀번호를 작성해주세요.' });
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      return toast.on({ label: '비밀번호 확인을 하지 않으셨어요. 비밀번호를 확인해주세요.' });
    }

    if (!isTermsChecked) {
      return toast.on({ label: '이용약관에 동의하지 않으셨어요. 동의하셔야 회원가입이 가능해요.' });
    }

    const data = { email, password, nickname };
    try {
      const response = await axios.post('/api/auth/sign-up', data);

      if (response.status === 200) {
        toast.on({ label: '회원가입이 완료되었어요. 로그인 후 서비스를 이용해봐요!' });

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;

    setEmail(newEmail);
    setEmailState(() => {
      if (newEmail === '') return 'default';
      else {
        if (!validateEmail(newEmail)) return 'error';
        else return 'filled';
      }
    });
  };

  const handleChangeNickname = (e: ChangeEvent<HTMLInputElement>): void => {
    const newNickname = e.target.value;

    setNickname(newNickname);
    setNicknameState(() => {
      if (newNickname === '') return 'default';
      else if (!validateNicknameNull(newNickname)) {
        return 'error';
      } else {
        if (!validateNickname(newNickname)) return 'error';
        else return 'filled';
      }
    });
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;

    setPassword(newPassword);
    setPasswordState(() => {
      if (newPassword === '') return 'default';
      else {
        if (!validatePassword(newPassword)) return 'error';
        else return 'filled';
      }
    });
  };

  const handleChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>): void => {
    const newConfirmPassword = e.target.value;

    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordState(() => {
      if (newConfirmPassword === '') return 'default';
      if (!validateConfirmPassword(password, newConfirmPassword)) return 'error';
      return 'filled';
    });
  };

  const checkTerms = (): void => {
    setIsTermsChecked(true);
    setIsOpenTerms(false);
  };

  const cancelTerms = (): void => {
    setIsTermsChecked(false);
    setIsOpenTerms(false);
  };

  if (!isVisible) return null;

  return (
    <BackDrop>
      {isOpenTerms ? (
        <TermsModal isTermsChecked={isTermsChecked} onConfirm={checkTerms} onCancel={cancelTerms} />
      ) : (
        <div className="w-335px-row-m md:w-744px-row flex flex-col justify-end items-end bg-sign-up pt-16px-col-m pb-24px-col-m px-16px-row-m md:pt-36px-col md:px-96px-row md:pb-56px-col gap-24px-col-m md:gap-48px-col rounded-2xl md:rounded-5xl border-2 md:border-4 border-border-color">
          <div className="flex flex-col items-end gap-4px-col-m md:gap-4px-col self-stretch">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-24px-row-m h-24px-col-m md:w-24px-row md:h-24px-col"
            >
              <XIconBlack />
            </button>
            <h2 className="w-full text-font-color text-18px-m md:text-24px font-bold text-center tracking-0.36px md:tracking-0.48px">
              회원가입
            </h2>
          </div>
          <div className="w-full flex flex-col items-start gap-24px-col-m md:gap-24px-col self-stretch">
            <div className="w-full flex flex-col gap-16px-col-m md:gap-16px-col items-start self-stretch">
              <Input
                type="email"
                state={emailState}
                value={email}
                setValue={setEmail}
                onChange={handleChangeEmail}
                label="이메일"
                validationMessage="ex)abcd@gmail.com"
                placeholder="이메일을 입력해주세요."
              />
              <Input
                type="text"
                state={nicknameState}
                value={nickname}
                setValue={setNickname}
                onChange={handleChangeNickname}
                label="이름"
                validationMessage="띄어쓰기는 불가능해요.(3~8글자 이내)"
                placeholder="사용할 이름을 입력해주세요."
              />
              <Input
                type="password"
                state={passwordState}
                value={password}
                setValue={setPassword}
                onChange={handleChangePassword}
                label="비밀번호"
                validationMessage="영문과 숫자를 포함해주세요.(6글자 이상)"
                placeholder="비밀번호를 입력해주세요."
              />
              <Input
                type="password"
                state={confirmPasswordState}
                value={confirmPassword}
                setValue={setConfirmPassword}
                onChange={handleChangeConfirmPassword}
                label="비밀번호 확인하기"
                validationMessage="상단에 입력한 비밀번호와 동일하게 입력해주세요"
                placeholder="비밀번호를 다시 입력해주세요."
              />
            </div>
            <div className="flex items-center justify-center gap-4px-row-m md:gap-4px-row">
              <Button onClick={() => setIsOpenTerms(true)} priority={'tertiary'} icon={<AngleRightBlue />}>
                이용약관 확인하기
              </Button>
              <span className="w-6 h-6 md:w-24px-row md:h-24px-col flex justify-center">
                {isTermsChecked ? <CheckTrue /> : <CheckFalse />}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-16px-row-m md:gap-16px-row mt-16px-col-m md:mt-0">
            <Button priority={'secondary'} onClick={onClose} icon={<XIconGreen />}>
              취소하기
            </Button>
            <Button onClick={handleClickSignUp} icon={<SignUpIcon />}>
              회원가입 완료하기
            </Button>
          </div>
        </div>
      )}
    </BackDrop>
  );
};

export default SignUpModal;
