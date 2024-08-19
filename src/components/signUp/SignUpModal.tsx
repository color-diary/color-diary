'use client';

import { useToast } from '@/providers/toast.context';
import { clearLocalDiaries, fetchLocalDiaries } from '@/utils/diaryLocalStorage';
import { urlToFile } from '@/utils/imageFileUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const router = useRouter();

  const toast = useToast();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitted }
  } = useForm<SignUpFormData>();

  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);

  useEffect(() => {
    if (!isSubmitted) {
      reset();
    }
  }, [isSubmitted,reset]);

  const { mutate: signUp } = useMutation({
    mutationFn: async (data: { email: string; nickname: string; password: string }) => {
      const response = await axios.post('/api/auth/sign-up', {
        email: data.email,
        nickname: data.nickname,
        password: data.password
      });

      const savedDiaries = fetchLocalDiaries();

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
      toast.on({ label: '회원가입이 완료되었어요. Color Inside를 이용해보세요!' });
      setIsTermsChecked(false);
      reset();
      onClose();

      queryClient.refetchQueries({ queryKey: ['user'] });
      queryClient.refetchQueries({ queryKey: ['information'] });
      queryClient.refetchQueries({ queryKey: ['diaries'] });
      queryClient.refetchQueries({ queryKey: ['main'] });

      router.replace('/');
    },
    onError: (error) => {
      console.error('회원가입 실패: ', error);
      toast.on({ label: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  });

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

  const handleError = (): void => {
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
                helperMessage={
                  errors.email
                    ? errors.email.message
                    : isSubmitted && !errors.email
                    ? '사용 가능한 이메일입니다.'
                    : 'ex)abcd@gmail.com'
                }
              />
              <ServiceInput
                type="text"
                state={errors.nickname ? 'error' : isSubmitted && !errors.nickname ? 'filled' : 'default'}
                {...register('nickname', {
                  required: '닉네임을 작성하지 않으셨어요. 닉네임을 작성해주세요.',
                  minLength: {
                    value: 3,
                    message: '닉네임은 3글자 이상이어야 합니다.'
                  },
                  maxLength: {
                    value: 8,
                    message: '닉네임은 8글자 이하이어야 합니다.'
                  },
                  pattern: {
                    value: /^[^\s]+$/,
                    message: '띄어쓰기는 불가능해요. 띄어쓰기를 없애주세요'
                  }
                })}
                label="닉네임"
                placeholder="사용할 닉네임을 입력해주세요."
                helperMessage={
                  errors.nickname
                    ? errors.nickname.message
                    : isSubmitted && !errors.nickname
                    ? '사용 가능한 닉네임입니다.'
                    : '띄어쓰기는 불가능해요.(3~8글자 이내)'
                }
              />
              <ServiceInput
                type="password"
                state={errors.password ? 'error' : isSubmitted && !errors.password ? 'filled' : 'default'}
                {...register('password', {
                  required: '비밀번호를 작성하지 않으셨어요. 비밀번호를 작성해주세요.',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 8글자 이상이어야 해요. 8글자이상 작성해주세요'
                  },
                  maxLength: {
                    value: 14,
                    message: '비밀번호는 14글자 이하이어야 해요. 8글자이하로 작성해주세요'
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,14}$/,
                    message: '비밀번호는 영문과 숫자를 포함해야 해요.'
                  }
                })}
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                helperMessage={
                  errors.password
                    ? errors.password.message
                    : isSubmitted && !errors.password
                    ? '사용 가능한 비밀번호입니다.'
                    : '영문과 숫자를 포함해주세요. (8~14글자)'
                }
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
                helperMessage={
                  errors.confirmPassword
                    ? errors.confirmPassword.message
                    : isSubmitted && !errors.confirmPassword
                    ? '비밀번호가 일치합니다.'
                    : '상단에 입력한 비밀번호와 동일하게 입력해주세요'
                }
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
