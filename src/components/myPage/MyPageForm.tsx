'use client';

import { useModal } from '@/providers/modal.context';
import { useToast } from '@/providers/toast.context';
import { validateNickname } from '@/utils/validation';
import { loginZustandStore } from '@/zustand/zustandStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import BackDrop from '../common/BackDrop';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ChangeNicknameModal from './ChangeNicknameModal';
import MyPageTermsModal from './MyPageTermsModal';
import ServiceModal from './ServiceModal';
import { Board } from './assets/Board';
import { Edit } from './assets/Edit';
import { Join } from './assets/Join';
import { Key } from './assets/Key';
import { Loading } from './assets/Loading';
import { Logout } from './assets/Log-out';
import { BlueMailIcon } from './assets/Mail';

const MyPageForm = () => {
  const toast = useToast();
  const modal = useModal();
  const router = useRouter();

  const queryClient = useQueryClient();

  const [newNickname, setNewNickname] = useState<string>('');
  const [isNicknameEditing, setIsNicknameEditing] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setIsLogin = loginZustandStore((state) => state.setIsLogin);
  const isLogin = loginZustandStore((state) => state.isLogin);

  const { data: userData, isPending } = useQuery({
    queryKey: ['information'],
    queryFn: async () => {
      const { data } = await axios.get('/api/auth/me/information');
      setNewNickname(data[0].nickname);
      return data;
    }
  });

  const { mutate: logOut } = useMutation({
    mutationFn: () => axios.delete('/api/auth/log-out'),
    onSuccess: () => {
      setIsLogin(false);
      router.replace('/');
      modal.close();
      toast.on({ label: '로그아웃 되었습니다.' });

      queryClient.removeQueries({ queryKey: ['information'] });
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['diaries'] });
      queryClient.removeQueries({ queryKey: ['main'] });
    },
    onError: (error) => {
      console.error('로그아웃 오류 발생: ', error);
    }
  });

  const { mutate: changeNickname } = useMutation({
    mutationFn: (nickname: string) => axios.patch('/api/auth/me/information', { nickname }),
    onSuccess: () => {
      setIsNicknameEditing(false);
      toast.on({ label: '닉네임이 성공적으로 변경되었습니다.' });

      queryClient.refetchQueries({ queryKey: ['information'] });
      queryClient.refetchQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('닉네임 수정 오류 발생: ', error);
    }
  });

  const { mutate: changeProfile } = useMutation({
    mutationFn: async (img: File) => {
      const formData = new FormData();
      formData.append('img', img);

      await axios.post('/api/auth/me/information', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      setIsLoadingImage(false);

      queryClient.refetchQueries({ queryKey: ['information'] });
      queryClient.refetchQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('프로필 이미지 업로드 오류 발생: ', error);
      setIsLoadingImage(false);
    }
  });

  const openTermsModal = (): void => {
    setShowTermsModal(true);
  };

  const closeTermsModal = (): void => {
    setShowTermsModal(false);
  };

  const openMyPageServiceModal = (): void => {
    setShowServiceModal(true);
  };

  const closeMyPageServiceModal = (): void => {
    setShowServiceModal(false);
  };

  const openChangePasswordModal = (): void => {
    setShowChangePasswordModal(true);
  };

  const closeChangePasswordModal = (): void => {
    setShowChangePasswordModal(false);
  };

  const handleClickChangeNickname = (): void => {
    if (!validateNickname(newNickname)) {
      toast.on({ label: '닉네임은 3글자 이상 8글자 이하이어야 합니다.' });
    } else {
      changeNickname(newNickname);
    }
  };

  const handleClickLogOut = (): void => {
    modal.open({
      label: '로그아웃 하실건가요?',
      onConfirm: logOut,
      onCancel: () => modal.close(),
      confirmButtonContent: {
        children: '로그아웃 하기',
        icon: <Logout />
      },
      cancelButtonContent: {
        children: '로그인 유지하기',
        icon: <Key />
      }
    });
  };

  const addImgFile = (file: File): void => {
    setIsLoadingImage(true);
    changeProfile(file);
  };

  if (isPending) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center mt-[148px] px-5 md:px-[396px] md:mt-[312px]">
      <div className="flex flex-col w-full md:w-[1128px] items-start justify-center self-stretch gap-32px-row-m md:gap-43px-row ">
        <div className="flex flex-col items-start md:flex-row md:items-center w-full md:gap-14">
          {isLogin && userData ? (
            <div className="flex w-[160px] h-[160px] md:w-240px-row md:h-240px-row relative">
              {isLoadingImage ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <Loading />
                </div>
              ) : null}
              <Image
                src={userData[0].profileImg || '/default-profile2.jpg'}
                alt="Profile Image"
                fill
                sizes="(max-width: 768px)"
                className={`cursor-pointer w-[80px] object-cover px-[15px] py-[15px] md:px-24px-col md:py-24px-col relative $ ${
                  isLoadingImage ? 'opacity-30' : ''
                } rounded-full`}
                onClick={() => fileInputRef.current?.click()}
                onLoad={() => setIsLoadingImage(false)}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    addImgFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex w-[160px] h-[160px] md:w-240px-row md:h-240px-row relative">
              <Image
                src="/default-profile.jpg"
                alt="Profile Image"
                fill
                sizes="(max-width: 768px)"
                className="rounded-full w-full object-cover px-24px-row py-24px-row"
                priority={true}
              />
            </div>
          )}
          {isLogin && userData ? (
            <div className="flex flex-col justify-center items-start gap-[24px] mt-4">
              <div className="flex flex-col items-start gap-4 md:gap-4">
                <div className="flex items-center gap-2 md:gap-2 text-[14px] md:text-18px">
                  <span className="py-1 w-[56px] md:w-[80px] font-normal">나의 이름</span>
                  {isNicknameEditing && isAuthSuccess ? (
                    <input
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      className="px-2 py-1 w-[200px] font-medium border border-gray-400 rounded-lg"
                    />
                  ) : (
                    <span className="px-2 py-1 w-[120px] md:w-[200px] font-medium">{userData[0].nickname}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 md:gap-2 text-[14px] md:text-18px">
                  <span className="py-1 w-[56px] md:w-[80px] font-normal">비밀번호</span>
                  <span className="px-2 py-1 w-[120px] md:w-[200px] font-normal">******</span>
                </div>
              </div>
              {isNicknameEditing && isAuthSuccess ? (
                <div className="flex items-center gap-2 md:gap-2">
                  <Button
                    priority="primary"
                    icon={<Edit />}
                    onClick={() => {
                      handleClickChangeNickname();
                    }}
                  >
                    정보수정 완료
                  </Button>
                </div>
              ) : (
                <Button
                  priority="primary"
                  icon={<Edit />}
                  onClick={() => {
                    setIsNicknameEditing(true);
                    openChangePasswordModal();
                  }}
                >
                  정보수정
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-start gap-[24px] mt-4">
              <div className="flex flex-col items-start md:gap-4">
                <div className="flex items-center gap-2 md:gap-2 text-14px-m md:text-18px">
                  <span className="py-4 w-[60px] md:w-[80px] font-normal">나의 이름</span>
                  <span className="px-2 py-4 w-[120px] md:w-[200px] font-medium">씨앗이</span>
                </div>
                <div className="flex items-center gap-2 md:gap-2 text-14px-m md:text-18px">
                  <span className="py-4 w-[60px] md:w-[80px] font-normal invisible">비밀번호</span>
                  <span className="px-2 py-4 w-[120px] md:w-[200px] font-normal invisible">******</span>
                </div>
              </div>
              <Button priority="primary" className="invisible">
                정보수정
              </Button>
            </div>
          )}
        </div>
        {isLogin ? (
          <div className="flex justify-between items-center self-stretch border-t border-[#080808] ">
            <div className="flex items-center mt-4 md:mt-[24px]">
              <Button priority="secondary" icon={<Logout />} size="lg" onClick={handleClickLogOut}>
                로그아웃
              </Button>
            </div>
            <div className="flex items-center gap-[16px] mt-4 md:mt-[24px]">
              <Button onClick={openMyPageServiceModal} priority="tertiary" icon={<BlueMailIcon />} size="lg">
                문의하기
              </Button>
              <Button onClick={openTermsModal} priority="tertiary" icon={<Board />} size="lg">
                이용약관
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center self-stretch border-t border-[#080808] ">
            <div className="flex items-center mt-4 md:mt-[24px]">
              <Button priority="primary" size="lg" icon={<Join />} href={'/log-in'}>
                회원가입
              </Button>
            </div>
            <div className="flex items-center gap-[16px] mt-4 md:mt-[24px]">
              <Button onClick={openMyPageServiceModal} priority="tertiary" icon={<BlueMailIcon />} size="lg">
                문의하기
              </Button>
              <Button onClick={openTermsModal} priority="tertiary" icon={<Board />} size="lg">
                이용약관
              </Button>
            </div>
          </div>
        )}
      </div>
      {showTermsModal && (
        <BackDrop>
          <div className="px-5">
            <MyPageTermsModal onClose={closeTermsModal} />
          </div>
        </BackDrop>
      )}
      {showServiceModal && (
        <BackDrop>
          <ServiceModal onClose={closeMyPageServiceModal} />
        </BackDrop>
      )}
      {showChangePasswordModal && (
        <BackDrop>
          <ChangeNicknameModal onClose={closeChangePasswordModal} onSuccess={() => setIsAuthSuccess(true)} />
        </BackDrop>
      )}
    </div>
  );
};

export default MyPageForm;
