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
import { Edit } from './svg/Edit';
import { Logout } from './svg/Log-out';
import { BlueMailIcon } from './svg/Mail';
import { Board } from './svg/Board';
import { Join } from './svg/Join';
import { Key } from './svg/Key';

const MyPageForm = () => {
  const supabase = createClient();
  const toast = useToast();
  const modal = useModal();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [profileImg, setProfileImg] = useState('/default-profile.jpg');
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
    setIsAuthSuccess(false);
  };

  const validateNickname = (nickname: string) => {
    return nickname.length >= 3;
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
          setProfileImg(userData[0].profileImg || '/default-profile.jpg');
        }
      }
    };
    nicknameData();
  }, [supabase]);

  const handleChangeNickname = async () => {
    if (!validateNickname(newNickname)) {
      toast.on({ label: '닉네임은 3글자 이상이어야 합니다.' });
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
      <div className='flex flex-col w-full md:w-[1128px] items-start justify-center self-stretch gap-8 md:gap-10 '>
        <div className='flex flex-col items-start md:flex-row md:items-center w-full md:gap-14'>
          {isLogin ? (
            <div className='flex w-[160px] h-[160px] md:w-240px-row md:h-240px-row relative'>
              {isLoadingImage ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                    width="100"
                    height="100"
                    style={{
                      shapeRendering: 'auto',
                      display: 'block',
                      background: 'transparent',
                    }}
                  >
                    <g>
                      <g>
                        <path
                          strokeWidth="3"
                          stroke="#e15b64"
                          fill="none"
                          d="M50 3A47 47 0 1 0 83.23401871576775 16.765981284232275"
                        ></path>
                        <path fill="#e15b64" d="M49 -4L49 10L56 3L49 -4"></path>
                        <animateTransform
                          keyTimes="0;1"
                          values="0 50 50;360 50 50"
                          dur="2.6315789473684212s"
                          repeatCount="indefinite"
                          type="rotate"
                          attributeName="transform"
                        ></animateTransform>
                      </g>
                    </g>
                  </svg>
                </div>
              ) : null}
              <Image
                src={profileImg}
                alt="Profile Image"
                fill
                className={`rounded-full cursor-pointer w-full object-cover px-[15px] py-[15px] md:px-[22.5px] md:py-[22.5px] relative ${isLoadingImage ? 'opacity-30' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onLoadingComplete={() => setIsLoadingImage(false)}
              />
              {!profileImg || profileImg === '/default-profile.jpg' ? (
                <svg className=' absolute z-10  bottom-12 right-4  flex-shrink-0 md:w-[43px] md:h-[43px]' xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 36 36" fill="none" style={{
                  borderRadius: '132px',
                  border: '1px solid var(--Grey-900, #080808)',
                  background: 'var(--Bg-600, #EEE2D2)'
                }}>
                  <path d="M10 18C10 17.7348 10.1054 17.4804 10.2929 17.2929C10.4804 17.1054 10.7348 17 11 17H17V11C17 10.7348 17.1054 10.4804 17.2929 10.2929C17.4804 10.1054 17.7348 10 18 10C18.2652 10 18.5196 10.1054 18.7071 10.2929C18.8946 10.4804 19 10.7348 19 11V17H25C25.2652 17 25.5196 17.1054 25.7071 17.2929C25.8946 17.4804 26 17.7348 26 18C26 18.2652 25.8946 18.5196 25.7071 18.7071C25.5196 18.8946 25.2652 19 25 19H19V25C19 25.2652 18.8946 25.5196 18.7071 25.7071C18.5196 25.8946 18.2652 26 18 26C17.7348 26 17.4804 25.8946 17.2929 25.7071C17.1054 25.5196 17 25.2652 17 25V19H11C10.7348 19 10.4804 18.8946 10.2929 18.7071C10.1054 18.5196 10 18.2652 10 18ZM18 34C22.2435 34 26.3131 32.3143 29.3137 29.3137C32.3143 26.3131 34 22.2435 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2C13.7565 2 9.68687 3.68571 6.68629 6.68629C3.68571 9.68687 2 13.7565 2 18C2 22.2435 3.68571 26.3131 6.68629 29.3137C9.68687 32.3143 13.7565 34 18 34ZM18 32C16.1615 32 14.341 31.6379 12.6424 30.9343C10.9439 30.2307 9.40053 29.1995 8.1005 27.8995C6.80048 26.5995 5.76925 25.0561 5.06569 23.3576C4.36212 21.659 4 19.8385 4 18C4 16.1615 4.36212 14.341 5.06569 12.6424C5.76925 10.9439 6.80048 9.40053 8.1005 8.1005C9.40053 6.80048 10.9439 5.76925 12.6424 5.06569C14.341 4.36212 16.1615 4 18 4C21.713 4 25.274 5.475 27.8995 8.1005C30.525 10.726 32 14.287 32 18C32 21.713 30.525 25.274 27.8995 27.8995C25.274 30.525 21.713 32 18 32Z" fill="#080808" />
                </svg>
              ) : null}
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
            <div className='flex w-[160px] h-[160px] md:w-[240px] md:h-[240px] relative'>
              <Image
                src={profileImg}
                alt="Profile Image"
                fill
                className="rounded-full w-full object-cover px-[22.5px] py-[22.5px]"
                onClick={() => fileInputRef.current?.click()}
                onLoadingComplete={() => setIsLoadingImage(false)}
              />
            </div>
          )}

          {isLogin ? (
            <div className='flex flex-col justify-center items-start gap-[24px] mt-4'>
              <div className='flex flex-col items-start gap-4 md:gap-4'>
                <div className='flex items-center gap-2 md:gap-2 text-[14px] md:text-18px'>
                  <span className='py-1 w-[56px] md:w-[80px] font-normal'>나의 이름</span>
                  {isAuthSuccess && isNicknameEditing ? (
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
                <div className='flex items-center gap-2 md:gap-2 text-[14px] md:text-[18px]'>
                  <span className='py-1 w-[56px] md:w-[80px] font-normal'>비밀번호</span>
                  <span className='px-2 py-1 w-[120px] md:w-[200px] font-normal'>******</span>
                </div>
              </div>
              {isAuthSuccess && isNicknameEditing ? (
                <div className='flex items-center gap-2 md:gap-2'>
                  <Button priority="primary" icon={<Edit />} onClick={handleChangeNickname}>정보수정 완료</Button>
                </div>
              ) : (
                <Button priority="primary" icon={<Edit />} onClick={() => { setIsNicknameEditing(true); openChangePasswordModal(); }}>정보수정</Button>
              )}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-start gap-[24px] mt-4'>
              <div className='flex flex-col items-start md:gap-4'>
                <div className='flex items-center gap-2 md:gap-2 text-[14px] md:text-[18px]'>
                  <span className='py-4 w-[56px] md:w-[80px] font-normal'>나의 이름</span>
                  <span className='px-2 py-4 w-[120px] md:w-[200px] font-medium'>씨앗이</span>
                </div>
                <div className='flex items-center gap-2 md:gap-2 text-[14px] md:text-[18px]'>
                  <span className='py-4 w-[56px] md:w-[80px] font-normal invisible'>비밀번호</span>
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
