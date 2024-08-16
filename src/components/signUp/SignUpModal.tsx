'use client';

import { useToast } from '@/providers/toast.context';
import { clearLocalDiaries, fetchLocalDiaries } from '@/utils/diaryLocalStorage';
import { urlToFile } from '@/utils/imageFileUtils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BackDrop from '../common/BackDrop';
import Button from '../common/Button';
import ServiceInput from '../common/ServiceInput';
import TermsModal from './TermsModal';
import AngleRightBlue from './assets/AngleRightBlue';
import CheckFalse from './assets/CheckFalse';
import CheckTrue from './assets/CheckTrue';
import SignUpIcon from './assets/SignUpIcon';
import XIconBlack from './assets/XIconBlack';
import XIconGreen from './assets/XIconGreen';

interface SignUpFormData {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isVisible, onClose }: ModalProps) => {
  const toast = useToast();

  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);

  const { mutate: signUp } = useMutation({
    mutationFn: async (data: { email: string; nickname: string; password: string }) => {
      const response = await axios.post('/api/auth/sign-up', {
        email: data.email,
        nickname: data.nickname,
        password: data.password
      });

      const savedDiaries = fetchLocalDiaries();

      console.log(response);

      if (savedDiaries.length) {
        savedDiaries.forEach(async (diary) => {
          const formData = new FormData();
          formData.append('userId', response.data);
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
    },
    onSuccess: () => {
      toast.on({ label: '회원가입이 완료되었어요. 로그인 후 서비스를 이용해봐요!' });

      reset();
      onClose();
    },
    onError: (error) => {
      console.error('회원가입 실패: ', error);
      toast.on({ label: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitted }
  } = useForm<SignUpFormData>();

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    if (!isTermsChecked) {
      return toast.on({ label: '이용약관에 동의하지 않으셨어요. 동의하셔야 회원가입이 가능해요.' });
    }

    signUp(data);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const checkTerms = (): void => {
    setIsTermsChecked(true);
    setIsOpenTerms(false);
    toast.on({ label: '이용약관에 동의하셨어요.' });
  };

  const cancelTerms = (): void => {
    setIsTermsChecked(false);
    setIsOpenTerms(false);
    toast.on({ label: '이용약관에 동의하지 않으셨어요.' });
  };

  const handleError = () => {
    trigger();
    if (errors.email) {
      toast.on({ label: errors.email.message || '이메일을 작성해주세요.' });
    } else if (errors.nickname) {
      toast.on({ label: errors.nickname.message || '이름을 작성해주세요.' });
    } else if (errors.password) {
      toast.on({ label: errors.password.message || '비밀번호를 작성해주세요.' });
    } else if (errors.confirmPassword) {
      toast.on({ label: errors.confirmPassword.message || '비밀번호 확인을 작성해주세요.' });
    }
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
          <form
            onSubmit={handleSubmit(onSubmit, handleError)}
            onKeyDown={handleKeyDown}
            className="w-full flex flex-col items-start gap-24px-col-m md:gap-24px-col self-stretch"
          >
            <div className="w-full flex flex-col gap-16px-col-m md:gap-16px-col items-start self-stretch">
              <ServiceInput
                type="email"
                state={errors.email ? 'error' : isSubmitted && !errors.email ? 'filled' : 'default'}
                {...register('email', {
                  required: '이메일을 작성하지 않으셨어요.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '유효한 이메일 형식이 아닙니다.'
                  }
                })}
                label="이메일"
                placeholder="이메일을 입력해주세요."
                helperMessage={errors.email?.message || 'ex)abcd@gmail.com'}
              />
              <ServiceInput
                type="text"
                state={errors.nickname ? 'error' : isSubmitted && !errors.nickname ? 'filled' : 'default'}
                {...register('nickname', {
                  required: '이름을 작성하지 않으셨어요. 이름을 작성해주세요.',
                  minLength: {
                    value: 3,
                    message: '이름은 3글자 이상이어야 합니다.'
                  },
                  maxLength: {
                    value: 8,
                    message: '이름은 8글자 이하이어야 합니다.'
                  },
                  pattern: {
                    value: /^[^\s]+$/,
                    message: '띄어쓰기는 불가능해요. 띄어쓰기를 없애주세요'
                  }
                })}
                label="이름"
                placeholder="사용할 이름을 입력해주세요."
                helperMessage={errors.nickname?.message || '띄어쓰기는 불가능해요.(3~8글자 이내)'}
              />

              <ServiceInput
                type="password"
                state={errors.password ? 'error' : isSubmitted && !errors.password ? 'filled' : 'default'}
                {...register('password', {
                  required: '비밀번호를 작성하지 않으셨어요. 비밀번호를 작성해주세요.',
                  minLength: {
                    value: 6,
                    message: '비밀번호는 6글자 이상이어야 합니다.'
                  },
                  pattern: {
                    value: /^[^\s]+$/,
                    message: '띄어쓰기는 불가능해요. 띄어쓰기를 없애주세요'
                  }
                })}
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                helperMessage={errors.password?.message || '영문과 숫자를 포함해주세요.(6글자 이상)'}
              />
              <ServiceInput
                type="password"
                state={errors.confirmPassword ? 'error' : isSubmitted && !errors.confirmPassword ? 'filled' : 'default'}
                {...register('confirmPassword', {
                  required: '비밀번호 확인을 하지 않으셨어요. 비밀번호를 확인해주세요',
                  validate: (value) =>
                    value === watch('password') || '상단에 입력한 비밀번호와 동일하지 않아요. 다시 작성해주세요.',
                  pattern: {
                    value: /^[^\s]+$/,
                    message: '띄어쓰기는 불가능해요. 띄어쓰기를 없애주세요'
                  }
                })}
                label="비밀번호 확인하기"
                placeholder="비밀번호를 다시 입력해주세요."
                helperMessage={errors.confirmPassword?.message || '상단에 입력한 비밀번호와 동일하게 입력해주세요'}
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
            <div className="flex w-full justify-end items-start gap-16px-row-m md:gap-16px-row mt-16px-col-m md:mt-0">
              <Button priority={'secondary'} onClick={onClose} icon={<XIconGreen />}>
                취소하기
              </Button>
              <Button type="submit" icon={<SignUpIcon />}>
                회원가입 완료하기
              </Button>
            </div>
          </form>
        </div>
      )}
    </BackDrop>
  );
};

export default SignUpModal;
