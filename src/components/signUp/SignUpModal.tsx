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

  const validateNickname = (nickname: string): boolean => {
    return nickname.length >= 3;
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

    if (!validateNickname(nickname)) {
      return toast.on({ label: '이름을 작성하지 않으셨어요. 이름을 작성해주세요.' });
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
      else {
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
        <div className="w-744px-row flex flex-col justify-end items-end bg-sign-up pt-36px-col px-96px-row pb-56px-col gap-48px-col rounded-5xl border-4 border-border-color">
          <div className="flex flex-col items-end gap-4px-col self-stretch">
            <button onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="calc(100vw * 0.01250)"
                height="calc(100vh * 0.02222)"
                viewBox="0 0 24 24"
                fill="none"
              >
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
            <h2 className="w-full text-font-color text-24px font-bold text-center tracking-0.48px">회원가입</h2>
          </div>
          <div className="w-full flex flex-col items-start gap-24px-col self-stretch">
            <div className="w-full flex flex-col gap-16px-col items-start self-stretch">
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
                validationMessage="띄어쓰기는 불가능해요"
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
            <div className="flex items-center justify-center gap-4px-row">
              <Button
                onClick={() => setIsOpenTerms(true)}
                priority={'tertiary'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      d="M7.64602 4.14702C7.73965 4.05315 7.86673 4.00031 7.99931 4.00012C8.13189 3.99994 8.25912 4.05241 8.35302 4.14602L13.837 9.61102C13.8883 9.66211 13.9289 9.72282 13.9567 9.78965C13.9844 9.85649 13.9987 9.92815 13.9987 10.0005C13.9987 10.0729 13.9844 10.1445 13.9567 10.2114C13.9289 10.2782 13.8883 10.3389 13.837 10.39L8.35302 15.855C8.25859 15.946 8.13221 15.9962 8.00111 15.9949C7.87001 15.9936 7.74467 15.9408 7.6521 15.848C7.55952 15.7551 7.50711 15.6296 7.50616 15.4985C7.50521 15.3674 7.55579 15.2412 7.64702 15.147L12.812 10L7.64702 4.85402C7.55315 4.76039 7.50031 4.63331 7.50012 4.50072C7.49994 4.36814 7.55241 4.24091 7.64602 4.14702Z"
                      fill="currentColor"
                    />
                  </svg>
                }
              >
                이용약관 확인하기
              </Button>
              <span className="w-24px-row h-24px-col flex justify-center">
                {isTermsChecked ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_2226_11984)">
                      <rect x="2" y="2" width="20" height="20" rx="4" fill="white" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.2893 6.53072C19.8246 6.96662 19.9052 7.75396 19.4693 8.2893L11.734 17.7893C11.5017 18.0746 11.1556 18.243 10.7878 18.2498C10.4199 18.2566 10.0678 18.101 9.82514 17.8245L4.56044 11.8245C4.10512 11.3056 4.15667 10.5158 4.67558 10.0605C5.1945 9.60514 5.98427 9.65669 6.4396 10.1756L10.729 15.0641L17.5307 6.71078C17.9666 6.17544 18.7539 6.09483 19.2893 6.53072Z"
                        fill="#25B18C"
                      />
                    </g>
                    <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#25B18C" />
                    <defs>
                      <clipPath id="clip0_2226_11984">
                        <rect x="2" y="2" width="20" height="20" rx="4" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="white" />
                    <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#A1A1A1" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-16px-row">
            <Button
              href={'/'}
              priority={'secondary'}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    d="M8.998 2.38799C9.27332 2.14063 9.63038 2.00378 10.0005 2.00378C10.3706 2.00378 10.7277 2.14063 11.003 2.38799L16.503 7.32999C16.6594 7.47062 16.7844 7.64256 16.8701 7.83465C16.9557 8.02673 17 8.23468 17 8.44499V15.5C17 15.8978 16.842 16.2793 16.5607 16.5607C16.2794 16.842 15.8978 17 15.5 17H13C12.6022 17 12.2206 16.842 11.9393 16.5607C11.658 16.2793 11.5 15.8978 11.5 15.5V12C11.5 11.8674 11.4473 11.7402 11.3536 11.6464C11.2598 11.5527 11.1326 11.5 11 11.5H9C8.86739 11.5 8.74022 11.5527 8.64645 11.6464C8.55268 11.7402 8.5 11.8674 8.5 12V15.5C8.5 15.8978 8.34197 16.2793 8.06066 16.5607C7.77936 16.842 7.39783 17 7 17H4.5C4.10218 17 3.72064 16.842 3.43934 16.5607C3.15804 16.2793 3 15.8978 3 15.5V8.44499C3 8.01999 3.18 7.61499 3.498 7.32999L8.998 2.38799ZM10.334 3.13199C10.2422 3.04963 10.1233 3.00407 10 3.00407C9.8767 3.00407 9.75775 3.04963 9.666 3.13199L4.166 8.07399C4.1139 8.12076 4.0722 8.17795 4.0436 8.24186C4.01501 8.30577 4.00015 8.37498 4 8.44499V15.5C4 15.6326 4.05268 15.7598 4.14645 15.8535C4.24022 15.9473 4.36739 16 4.5 16H7C7.13261 16 7.25979 15.9473 7.35355 15.8535C7.44732 15.7598 7.5 15.6326 7.5 15.5V12C7.5 11.6022 7.65804 11.2206 7.93934 10.9393C8.22064 10.658 8.60218 10.5 9 10.5H11C11.3978 10.5 11.7794 10.658 12.0607 10.9393C12.342 11.2206 12.5 11.6022 12.5 12V15.5C12.5 15.6326 12.5527 15.7598 12.6464 15.8535C12.7402 15.9473 12.8674 16 13 16H15.5C15.6326 16 15.7598 15.9473 15.8536 15.8535C15.9473 15.7598 16 15.6326 16 15.5V8.44499C15.9999 8.37498 15.985 8.30577 15.9564 8.24186C15.9278 8.17795 15.8861 8.12076 15.834 8.07399L10.334 3.13199Z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              홈으로 돌아가기
            </Button>
            <Button
              onClick={handleClickSignUp}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    d="M9 2C7.93913 2 6.92172 2.42143 6.17157 3.17157C5.42143 3.92172 5 4.93913 5 6C5 7.06087 5.42143 8.07828 6.17157 8.82843C6.92172 9.57857 7.93913 10 9 10C10.0609 10 11.0783 9.57857 11.8284 8.82843C12.5786 8.07828 13 7.06087 13 6C13 4.93913 12.5786 3.92172 11.8284 3.17157C11.0783 2.42143 10.0609 2 9 2ZM6 6C6 5.20435 6.31607 4.44129 6.87868 3.87868C7.44129 3.31607 8.20435 3 9 3C9.79565 3 10.5587 3.31607 11.1213 3.87868C11.6839 4.44129 12 5.20435 12 6C12 6.79565 11.6839 7.55871 11.1213 8.12132C10.5587 8.68393 9.79565 9 9 9C8.20435 9 7.44129 8.68393 6.87868 8.12132C6.31607 7.55871 6 6.79565 6 6ZM4.009 11C3.7456 10.9988 3.48456 11.0497 3.24087 11.1496C2.99718 11.2496 2.77564 11.3968 2.58896 11.5826C2.40229 11.7684 2.25417 11.9893 2.1531 12.2325C2.05203 12.4758 2 12.7366 2 13C2 14.691 2.833 15.966 4.135 16.797C5.417 17.614 7.145 18 9 18C9.41133 18 9.81467 17.981 10.21 17.943C9.97137 17.6459 9.76426 17.3249 9.592 16.985C9.398 16.995 9.20067 17 9 17C7.265 17 5.743 16.636 4.673 15.953C3.623 15.283 3 14.31 3 13C3 12.447 3.448 12 4.009 12H9.599C9.78367 11.6413 10.003 11.308 10.257 11H4.009ZM14.5 19C15.6935 19 16.8381 18.5259 17.682 17.682C18.5259 16.8381 19 15.6935 19 14.5C19 13.3065 18.5259 12.1619 17.682 11.318C16.8381 10.4741 15.6935 10 14.5 10C13.3065 10 12.1619 10.4741 11.318 11.318C10.4741 12.1619 10 13.3065 10 14.5C10 15.6935 10.4741 16.8381 11.318 17.682C12.1619 18.5259 13.3065 19 14.5 19ZM14.5 12C14.6326 12 14.7598 12.0527 14.8536 12.1464C14.9473 12.2402 15 12.3674 15 12.5V14H16.5C16.6326 14 16.7598 14.0527 16.8536 14.1464C16.9473 14.2402 17 14.3674 17 14.5C17 14.6326 16.9473 14.7598 16.8536 14.8536C16.7598 14.9473 16.6326 15 16.5 15H15V16.5C15 16.6326 14.9473 16.7598 14.8536 16.8536C14.7598 16.9473 14.6326 17 14.5 17C14.3674 17 14.2402 16.9473 14.1464 16.8536C14.0527 16.7598 14 16.6326 14 16.5V15H12.5C12.3674 15 12.2402 14.9473 12.1464 14.8536C12.0527 14.7598 12 14.6326 12 14.5C12 14.3674 12.0527 14.2402 12.1464 14.1464C12.2402 14.0527 12.3674 14 12.5 14H14V12.5C14 12.3674 14.0527 12.2402 14.1464 12.1464C14.2402 12.0527 14.3674 12 14.5 12Z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              회원가입 완료하기
            </Button>
          </div>
        </div>
      )}
    </BackDrop>
  );
};

export default SignUpModal;
