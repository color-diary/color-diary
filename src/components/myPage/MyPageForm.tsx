'use client';

import { useModal } from '@/providers/modal.context';
import { useToast } from '@/providers/toast.context';
import { createClient } from '@/utils/supabase/client';
import { loginZustandStore } from '@/zustand/zustandStore';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BackDrop from '../common/BackDrop';
import Button from '../common/Button';
import MyPageTermsModal from './MyPageTermsModal';
import ServiceModal from './ServiceModal';
import ChangeNicknameModal from './ChangeNicknameModal';
import { Edit } from './assets/Edit';
import { Logout } from './assets/Log-out';
import { BlueMailIcon } from './assets/Mail';
import { Board } from './assets/Board';
import { Join } from './assets/Join';
import { Key } from './assets/Key';
import { Loading } from './assets/Loading';

const MyPageForm = () => {
  const supabase = createClient();
  const toast = useToast();
  const modal = useModal();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [profileImg, setProfileImg] = useState('/default-profile2.jpg');
  const isDefaultImage = profileImg === '/default-profile2.jpg';
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const publicSetProfileImg = loginZustandStore((state) => state.publicSetProfileImg);
  const setIsLogin = loginZustandStore((state) => state.setIsLogin);
  const isLogin = loginZustandStore((state) => state.isLogin);

  const openTermsModal = () => {
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const openMyPageServiceModal = () => {
    setShowServiceModal(true);
  };

  const closeMyPageServiceModal = () => {
    setShowServiceModal(false);
  };

  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const validateNickname = (nickname: string) => {
    return nickname.length >= 3 && nickname.length <= 8;
  };


  useEffect(() => {
    const nicknameData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const { data: userData } = await supabase.from('users').select('nickname,profileImg').eq('id', data.user?.id);
        if (userData) {
          const userNickname = userData[0].nickname;
          setNickname(userNickname);
          setNewNickname(userNickname);
          setProfileImg(userData[0].profileImg || '/default-profile2.jpg');
        }
      }
    };
    nicknameData();
  }, [supabase]);

  const handleChangeNickname = async () => {
    if (!validateNickname(newNickname)) {
      toast.on({ label: '닉네임은 3글자 이상 8글자 이하이어야 합니다.' });
      setNewNickname(nickname);
      return;
    }


    try {
      const { data: userInfo } = await supabase.auth.getUser();
      if (userInfo.user) {
        const userId = userInfo.user.id;
        const { error } = await supabase.from('users').update({ nickname: newNickname }).eq('id', userId);
        if (!error) {
          setNickname(newNickname);
          setIsNicknameEditing(false);
          toast.on({ label: '닉네임이 성공적으로 변경되었습니다.' });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmLogOut = async () => {
    try {
      const response = await axios.delete('/api/auth/log-out');
      if (response.status === 200) {
        setIsLogin(false);
        publicSetProfileImg('');
        router.replace('/');
        modal.close();
        toast.on({ label: '로그아웃 되었습니다.' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickLogOut = async () => {
    modal.open({
      label: '로그아웃 하실건가요?',
      onConfirm: confirmLogOut,
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

  const addImgFile = async (file: File) => {
    try {
      setIsLoadingImage(true);
      const newFileName = `${Date.now()}.jpg`;
      const { error } = await supabase.storage.from('profileImg').upload(`${newFileName}`, file);
      if (error) {
        console.error(error);
        setIsLoadingImage(false);
        return;
      }
      const res = supabase.storage.from('profileImg').getPublicUrl(newFileName);
      setProfileImg(res.data.publicUrl);
      publicSetProfileImg(res.data.publicUrl);
      const { data: userInfo } = await supabase.auth.getUser();
      const userId = userInfo.user?.id;
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .update({ profileImg: res.data.publicUrl })
          .eq('id', userId);
      }
      setIsLoadingImage(false);
    } catch (error) {
      console.error(error);
      setIsLoadingImage(false);
    }
  };

  return (
    <div className='flex items-center justify-center mt-[148px] px-5 md:px-[396px] md:mt-[312px]'>
      <div className='flex flex-col w-full md:w-[1128px] items-start justify-center self-stretch gap-32px-row-m md:gap-43px-row '>
        <div className='flex flex-col items-start md:flex-row md:items-center w-full md:gap-14'>
          {isLogin ? (
            <div className='flex w-[160px] h-[160px] md:w-240px-row md:h-240px-row relative'>
              {isLoadingImage ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <Loading />
                </div>
              ) : null}
              <Image
                src={profileImg}
                alt="Profile Image"
                fill
                sizes="(max-width: 768px)"
                className={`cursor-pointer w-[80px] object-cover px-[15px] py-[15px] md:px-24px-col md:py-24px-col relative ${isDefaultImage ? '' : 'rounded-full'} ${isLoadingImage ? 'opacity-30' : ''}`}
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
            <div className='flex w-[160px] h-[160px] md:w-240px-row md:h-240px-row relative'>
              <Image
                src='/default-profile.jpg'
                alt="Profile Image"
                fill
                sizes="(max-width: 768px)"
                className="rounded-full w-full object-cover px-24px-row py-24px-row"
                priority={true}
              />
            </div>
          )}

          {isLogin ? (
            <div className='flex flex-col justify-center items-start gap-[24px] mt-4'>
              <div className='flex flex-col items-start gap-4 md:gap-4'>
                <div className='flex items-center gap-2 md:gap-2 text-[14px] md:text-18px'>
                  <span className='py-1 w-[56px] md:w-[80px] font-normal'>나의 이름</span>
                  {isNicknameEditing && isAuthSuccess ? (
                    <input
                      type='text'
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      className='px-2 py-1 w-[200px] font-medium border border-gray-400 rounded-lg'
                    />
                  ) : (
                    <span className='px-2 py-1 w-[120px] md:w-[200px] font-medium'>{nickname}</span>
                  )}
                </div>
                <div className='flex items-center gap-2 md:gap-2 text-[14px] md:text-18px'>
                  <span className='py-1 w-[56px] md:w-[80px] font-normal'>비밀번호</span>
                  <span className='px-2 py-1 w-[120px] md:w-[200px] font-normal'>******</span>
                </div>
              </div>
              {isNicknameEditing && isAuthSuccess ? (
                <div className='flex items-center gap-2 md:gap-2'>
                  <Button priority="primary" icon={<Edit />} onClick={() => { handleChangeNickname(); setIsAuthSuccess(false) }} >정보수정 완료</Button>
                </div>
              ) : (
                <Button priority="primary" icon={<Edit />} onClick={() => { setIsNicknameEditing(true); openChangePasswordModal(); }}>정보수정</Button>
              )}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-start gap-[24px] mt-4'>
              <div className='flex flex-col items-start md:gap-4'>
                <div className='flex items-center gap-2 md:gap-2 text-14px-m md:text-18px'>
                  <span className='py-4 w-[60px] md:w-[80px] font-normal'>나의 이름</span>
                  <span className='px-2 py-4 w-[120px] md:w-[200px] font-medium'>씨앗이</span>
                </div>
                <div className='flex items-center gap-2 md:gap-2 text-14px-m md:text-18px'>
                  <span className='py-4 w-[60px] md:w-[80px] font-normal invisible'>비밀번호</span>
                  <span className='px-2 py-4 w-[120px] md:w-[200px] font-normal invisible'>******</span>
                </div>
              </div>
              <Button priority="primary" className='invisible'>정보수정</Button>
            </div>
          )}
        </div>

        {isLogin ? (
          <div className='flex justify-between items-center self-stretch border-t border-[#080808] '>
            <div className='flex items-center mt-4 md:mt-[24px]'>
              <Button priority="secondary" icon={<Logout />} size="lg" onClick={handleClickLogOut}>로그아웃</Button>
            </div>
            <div className='flex items-center gap-[16px] mt-4 md:mt-[24px]'>
              <Button onClick={openMyPageServiceModal} priority="tertiary" icon={<BlueMailIcon />} size="lg">문의하기</Button>
              <Button onClick={openTermsModal} priority="tertiary" icon={<Board />} size="lg">이용약관</Button>
            </div>
          </div>
        ) : (
          <div className='flex justify-between items-center self-stretch border-t border-[#080808] '>
            <div className='flex items-center mt-4 md:mt-[24px]'>
              <Button priority="primary" size="lg" icon={<Join />} href={"/log-in"}>회원가입</Button>
            </div>
            <div className='flex items-center gap-[16px] mt-4 md:mt-[24px]'>
              <Button onClick={openMyPageServiceModal} priority="tertiary" icon={<BlueMailIcon />} size="lg">문의하기</Button>
              <Button onClick={openTermsModal} priority="tertiary" icon={<Board />} size="lg">이용약관</Button>
            </div>
          </div>
        )}
      </div>
      {showTermsModal && (
        <BackDrop>
          <div className='px-5'>
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
