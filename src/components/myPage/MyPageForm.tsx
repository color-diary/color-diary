"use client"
import { createClient } from '@/utils/supabase/client'
import { loginZustandStore } from '@/zustand/zustandStore';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Button from '../common/Button';

const MyPageForm = () => {
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const publicSetProfileImg = loginZustandStore(state => state.publicSetProfileImg);
  const publicProfileImg = loginZustandStore(state => state.publicProfileImg)
  const setIsLogin = loginZustandStore(state => state.setIsLogin);
  const isLogin = loginZustandStore(state => state.isLogin);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const nicknameData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const { data: userData } = await supabase.from('users').select('nickname,profileImg').eq('id', data.user?.id);
        console.log('userData => ', userData);
        if (userData) {
          const userNickname = userData[0].nickname;
          setNickname(userNickname);
          setNewNickname(userNickname);
          setProfileImg(userData[0].profileImg || '/default-profile.jpg');
        }
      }
      console.log('getUserData => ', data);
    };
    nicknameData();
  }, [supabase]);

  const changeNicknameHandler = async () => {
    try {
      const { data: userInfo } = await supabase.auth.getUser();
      console.log('로그인된 유저정보=>', userInfo);
      if (userInfo.user) {
        const userId = userInfo.user.id;
        const { data, error } = await supabase.from('users').update({ nickname: newNickname }).eq('id', userId);
        if (!error) {
          setNickname(newNickname);
          alert('닉네임이 성공적으로 변경되었습니다.');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logoutHandler = async () => {
    const response = await axios.delete('/api/auth/log-out');
    try {
      if (response.status === 200) {
        alert(response.data.message);
        console.log('로그아웃 성공');
        setIsLogin(false);
        publicSetProfileImg('');
        router.replace('/');
      }
    } catch (error) {
      console.error('에러메세지=> ', error);
      if (axios.isAxiosError(error) && error.response) alert(error?.response.data.message);
      console.error(error);
      console.log('로그아웃 실패');
    }
  };

  const addImgFile = async (file: File) => {
    try {
      const newFileName = `${Date.now()}.jpg`;
      const { data, error } = await supabase.storage.from('profileImg').upload(`${newFileName}`, file);
      if (error) {
        console.error(error);
        return;
      }
      const res = supabase.storage.from('profileImg').getPublicUrl(newFileName);
      console.log('res데이터', res.data.publicUrl);
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[312px]">
      <div className="w-[1128px] h-[280px] flex flex-row items-center ml-[40px]">
        {isLogin ? <Image
          src={profileImg}
          alt="Profile Image"
          width={195}
          height={195}
          className="rounded-full cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        /> : <Image
          src={"/default-profile.jpg"}
          alt="defaultProfile Image"
          width={195}
          height={195}
          className="rounded-full"
        />}

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => { if (e.target.files) { addImgFile(e.target.files[0]) } }}
          className="hidden"
        />

        <div className="mt-4 ml-[70px] flex flex-col items-start w-[288px] h-[156px]">
          {isLogin ? (
            <div>
              <div className="flex flex-col items-start w-[288px] text-xl">
                <div className="flex items-center gap-4">
                  <span className="mr-2 w-[auto]">나의 이름</span>
                  <span>{nickname}</span>
                </div>
                <div className="flex items-center mt-[16px] mb-[24px] w-[auto] gap-4 text-xl">
                  <span className="mr-2 ">비밀 번호</span>
                  <span className='mr-2 text-[#a0a0a0] '>********</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-start w-[288px] text-xl">
                <div className="flex items-center gap-4">
                  <span className="mr-2 w-[auto]">나의이름</span>
                  <span>비회원</span>
                </div>
              </div>
            </div>
          )}
          {isLogin ?
            <Button  icon={ <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.18 2.926C16.9065 2.63822 16.5781 2.40811 16.2143 2.24922C15.8504 2.09033 15.4584 2.00588 15.0614 2.00085C14.6644 1.99582 14.2704 2.0703 13.9026 2.21992C13.5349 2.36953 13.2008 2.59125 12.92 2.872L3.54503 12.247C3.2178 12.5748 2.99062 12.9889 2.89003 13.441L2.01203 17.391C1.99367 17.4732 1.99636 17.5587 2.01986 17.6395C2.04336 17.7204 2.0869 17.794 2.14645 17.8536C2.20599 17.9131 2.27962 17.9567 2.36049 17.9802C2.44135 18.0037 2.52685 18.0064 2.60903 17.988L6.53503 17.115C7.00283 17.0119 7.43115 16.7766 7.76903 16.437L15.749 8.457L16.086 8.793C16.2735 8.98053 16.3788 9.23484 16.3788 9.5C16.3788 9.76517 16.2735 10.0195 16.086 10.207L15.146 11.147C15.0551 11.2414 15.0049 11.3678 15.0062 11.4989C15.0075 11.63 15.0603 11.7553 15.1531 11.8479C15.2459 11.9405 15.3714 11.9929 15.5025 11.9939C15.6336 11.9948 15.7599 11.9442 15.854 11.853L16.793 10.913C17.168 10.5379 17.3786 10.0293 17.3786 9.499C17.3786 8.96867 17.168 8.46006 16.793 8.085L16.457 7.749L17.127 7.079C17.6755 6.53024 17.988 5.78891 17.9977 5.01308C18.0074 4.23725 17.7146 3.48832 17.18 2.926ZM13.626 3.579C13.9973 3.213 14.4983 3.00866 15.0196 3.01053C15.5409 3.0124 16.0404 3.22033 16.4091 3.58898C16.7777 3.95763 16.9856 4.45709 16.9875 4.97843C16.9894 5.49978 16.785 6.00072 16.419 6.372L7.06203 15.73C6.8586 15.9351 6.60025 16.0772 6.31803 16.139L3.15803 16.841L3.86603 13.658C3.92511 13.3912 4.05941 13.1469 4.25303 12.954L13.626 3.579Z" fill="white" />
            </svg>} onClick={changeNicknameHandler}>정보수정</Button>
           : null}
        </div>

      </div>
      <hr className='border-[1px] w-[1128px] mt-[20px] border-gray-900' />
      <div className="mt-[24px] flex justify-between w-[1128px]">
        {isLogin ?
          <Button size="lg" priority={"secondary"} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0001 15.6001C12.3184 15.6001 12.6236 15.4736 12.8486 15.2486C13.0737 15.0236 13.2001 14.7183 13.2001 14.4001C13.2001 14.0818 13.0737 13.7766 12.8486 13.5515C12.6236 13.3265 12.3184 13.2001 12.0001 13.2001C11.6818 13.2001 11.3766 13.3265 11.1516 13.5515C10.9265 13.7766 10.8001 14.0818 10.8001 14.4001C10.8001 14.7183 10.9265 15.0236 11.1516 15.2486C11.3766 15.4736 11.6818 15.6001 12.0001 15.6001ZM18.0001 2.40007C17.3636 2.40007 16.7531 2.65293 16.303 3.10302C15.853 3.5531 15.6001 4.16355 15.6001 4.80007V7.20007H16.8001C17.7549 7.20007 18.6706 7.57936 19.3457 8.25449C20.0208 8.92962 20.4001 9.84529 20.4001 10.8001V18.0001C20.4001 18.9549 20.0208 19.8705 19.3457 20.5457C18.6706 21.2208 17.7549 21.6001 16.8001 21.6001H7.2001C6.24532 21.6001 5.32964 21.2208 4.65451 20.5457C3.97938 19.8705 3.6001 18.9549 3.6001 18.0001V10.8001C3.6001 9.84529 3.97938 8.92962 4.65451 8.25449C5.32964 7.57936 6.24532 7.20007 7.2001 7.20007H14.4001V4.80007C14.4001 3.84529 14.7794 2.92962 15.4545 2.25449C16.1296 1.57936 17.0453 1.20007 18.0001 1.20007C18.9549 1.20007 19.8706 1.57936 20.5457 2.25449C21.2208 2.92962 21.6001 3.84529 21.6001 4.80007V5.40007C21.6001 5.5592 21.5369 5.71182 21.4244 5.82434C21.3118 5.93686 21.1592 6.00007 21.0001 6.00007C20.841 6.00007 20.6884 5.93686 20.5758 5.82434C20.4633 5.71182 20.4001 5.5592 20.4001 5.40007V4.80007C20.4001 4.16355 20.1472 3.5531 19.6972 3.10302C19.2471 2.65293 18.6366 2.40007 18.0001 2.40007ZM16.8001 8.40007H7.2001C6.56358 8.40007 5.95313 8.65293 5.50304 9.10302C5.05295 9.5531 4.8001 10.1636 4.8001 10.8001V18.0001C4.8001 18.6366 5.05295 19.247 5.50304 19.6971C5.95313 20.1472 6.56358 20.4001 7.2001 20.4001H16.8001C17.4366 20.4001 18.0471 20.1472 18.4972 19.6971C18.9472 19.247 19.2001 18.6366 19.2001 18.0001V10.8001C19.2001 10.1636 18.9472 9.5531 18.4972 9.10302C18.0471 8.65293 17.4366 8.40007 16.8001 8.40007Z" fill="#25B18C" />
          </svg>} onClick={logoutHandler}>로그아웃</Button>

          : <Link href={'log-in'}>
            <Button size="lg" icon={<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7999 2.3999C9.52686 2.3999 8.30596 2.90562 7.40579 3.80579C6.50561 4.70596 5.9999 5.92686 5.9999 7.1999C5.9999 8.47294 6.50561 9.69384 7.40579 10.594C8.30596 11.4942 9.52686 11.9999 10.7999 11.9999C12.0729 11.9999 13.2938 11.4942 14.194 10.594C15.0942 9.69384 15.5999 8.47294 15.5999 7.1999C15.5999 5.92686 15.0942 4.70596 14.194 3.80579C13.2938 2.90562 12.0729 2.3999 10.7999 2.3999ZM7.1999 7.1999C7.1999 6.24512 7.57919 5.32945 8.25432 4.65432C8.92945 3.97919 9.84512 3.5999 10.7999 3.5999C11.7547 3.5999 12.6704 3.97919 13.3455 4.65432C14.0206 5.32945 14.3999 6.24512 14.3999 7.1999C14.3999 8.15468 14.0206 9.07036 13.3455 9.74549C12.6704 10.4206 11.7547 10.7999 10.7999 10.7999C9.84512 10.7999 8.92945 10.4206 8.25432 9.74549C7.57919 9.07036 7.1999 8.15468 7.1999 7.1999ZM4.8107 13.1999C4.49462 13.1985 4.18137 13.2595 3.88895 13.3795C3.59652 13.4995 3.33067 13.676 3.10666 13.899C2.88265 14.122 2.70491 14.3871 2.58362 14.679C2.46233 14.9708 2.3999 15.2838 2.3999 15.5999C2.3999 17.6291 3.3995 19.1591 4.9619 20.1563C6.5003 21.1367 8.5739 21.5999 10.7999 21.5999C11.2935 21.5999 11.7775 21.5771 12.2519 21.5315C11.9655 21.175 11.717 20.7898 11.5103 20.3819C11.2775 20.3939 11.0407 20.3999 10.7999 20.3999C8.7179 20.3999 6.8915 19.9631 5.6075 19.1435C4.3475 18.3395 3.5999 17.1719 3.5999 15.5999C3.5999 14.9363 4.1375 14.3999 4.8107 14.3999H11.5187C11.7403 13.9695 12.0035 13.5695 12.3083 13.1999H4.8107ZM17.3999 22.7999C18.8321 22.7999 20.2056 22.231 21.2183 21.2183C22.231 20.2056 22.7999 18.8321 22.7999 17.3999C22.7999 15.9677 22.231 14.5942 21.2183 13.5815C20.2056 12.5688 18.8321 11.9999 17.3999 11.9999C15.9677 11.9999 14.5942 12.5688 13.5815 13.5815C12.5688 14.5942 11.9999 15.9677 11.9999 17.3999C11.9999 18.8321 12.5688 20.2056 13.5815 21.2183C14.5942 22.231 15.9677 22.7999 17.3999 22.7999ZM17.3999 14.3999C17.559 14.3999 17.7116 14.4631 17.8242 14.5756C17.9367 14.6882 17.9999 14.8408 17.9999 14.9999V16.7999H19.7999C19.959 16.7999 20.1116 16.8631 20.2242 16.9756C20.3367 17.0882 20.3999 17.2408 20.3999 17.3999C20.3999 17.559 20.3367 17.7116 20.2242 17.8242C20.1116 17.9367 19.959 17.9999 19.7999 17.9999H17.9999V19.7999C17.9999 19.959 17.9367 20.1116 17.8242 20.2242C17.7116 20.3367 17.559 20.3999 17.3999 20.3999C17.2408 20.3999 17.0882 20.3367 16.9756 20.2242C16.8631 20.1116 16.7999 19.959 16.7999 19.7999V17.9999H14.9999C14.8408 17.9999 14.6882 17.9367 14.5756 17.8242C14.4631 17.7116 14.3999 17.559 14.3999 17.3999C14.3999 17.2408 14.4631 17.0882 14.5756 16.9756C14.6882 16.8631 14.8408 16.7999 14.9999 16.7999H16.7999V14.9999C16.7999 14.8408 16.8631 14.6882 16.9756 14.5756C17.0882 14.4631 17.2408 14.3999 17.3999 14.3999Z" fill="white" />
            </svg>}>회원가입

            </Button>
            <div className="w-6 h-6 relative" />
          </Link>}


        <div className='flex gap-4'>

          <div>
            <Button size="lg" priority="tertiary" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.6 4.80017C19.3957 4.80017 20.1587 5.11624 20.7213 5.67885C21.284 6.24146 21.6 7.00452 21.6 7.80017V17.4002C21.6 18.1958 21.284 18.9589 20.7213 19.5215C20.1587 20.0841 19.3957 20.4002 18.6 20.4002H5.40002C4.60438 20.4002 3.84131 20.0841 3.2787 19.5215C2.71609 18.9589 2.40002 18.1958 2.40002 17.4002V7.80017C2.40002 7.00452 2.71609 6.24146 3.2787 5.67885C3.84131 5.11624 4.60438 4.80017 5.40002 4.80017H18.6ZM20.4 9.55337L12.3048 14.3174C12.2283 14.3623 12.1427 14.3897 12.0543 14.3976C11.9659 14.4055 11.8769 14.3936 11.7936 14.363L11.6952 14.3174L3.60002 9.55577V17.4002C3.60002 17.8776 3.78967 18.3354 4.12723 18.673C4.4648 19.0105 4.92263 19.2002 5.40002 19.2002H18.6C19.0774 19.2002 19.5353 19.0105 19.8728 18.673C20.2104 18.3354 20.4 17.8776 20.4 17.4002V9.55337ZM18.6 6.00017H5.40002C4.92263 6.00017 4.4648 6.18981 4.12723 6.52738C3.78967 6.86494 3.60002 7.32278 3.60002 7.80017V8.16257L12 13.1042L20.4 8.16017V7.80017C20.4 7.32278 20.2104 6.86494 19.8728 6.52738C19.5353 6.18981 19.0774 6.00017 18.6 6.00017Z" fill="#3697F2" />
            </svg>}>문의하기</Button></div>

          <div>
            <Button priority="tertiary" size="lg" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8 10.2001C10.8 10.041 10.8633 9.8884 10.9758 9.77588C11.0883 9.66336 11.2409 9.60015 11.4 9.60015H15.6C15.7592 9.60015 15.9118 9.66336 16.0243 9.77588C16.1368 9.8884 16.2 10.041 16.2 10.2001C16.2 10.3593 16.1368 10.5119 16.0243 10.6244C15.9118 10.7369 15.7592 10.8001 15.6 10.8001H11.4C11.2409 10.8001 11.0883 10.7369 10.9758 10.6244C10.8633 10.5119 10.8 10.3593 10.8 10.2001ZM10.8 13.8001C10.8 13.641 10.8633 13.4884 10.9758 13.3759C11.0883 13.2634 11.2409 13.2001 11.4 13.2001H15.6C15.7592 13.2001 15.9118 13.2634 16.0243 13.3759C16.1368 13.4884 16.2 13.641 16.2 13.8001C16.2 13.9593 16.1368 14.1119 16.0243 14.2244C15.9118 14.3369 15.7592 14.4001 15.6 14.4001H11.4C11.2409 14.4001 11.0883 14.3369 10.9758 14.2244C10.8633 14.1119 10.8 13.9593 10.8 13.8001ZM10.8 17.4001C10.8 17.241 10.8633 17.0884 10.9758 16.9759C11.0883 16.8634 11.2409 16.8001 11.4 16.8001H15.6C15.7592 16.8001 15.9118 16.8634 16.0243 16.9759C16.1368 17.0884 16.2 17.241 16.2 17.4001C16.2 17.5593 16.1368 17.7119 16.0243 17.8244C15.9118 17.9369 15.7592 18.0001 15.6 18.0001H11.4C11.2409 18.0001 11.0883 17.9369 10.9758 17.8244C10.8633 17.7119 10.8 17.5593 10.8 17.4001ZM9.60005 10.2001C9.60005 10.4388 9.50523 10.6678 9.33645 10.8365C9.16766 11.0053 8.93874 11.1001 8.70005 11.1001C8.46135 11.1001 8.23244 11.0053 8.06365 10.8365C7.89487 10.6678 7.80005 10.4388 7.80005 10.2001C7.80005 9.96145 7.89487 9.73253 8.06365 9.56375C8.23244 9.39497 8.46135 9.30015 8.70005 9.30015C8.93874 9.30015 9.16766 9.39497 9.33645 9.56375C9.50523 9.73253 9.60005 9.96145 9.60005 10.2001ZM9.60005 13.8001C9.60005 14.0388 9.50523 14.2678 9.33645 14.4365C9.16766 14.6053 8.93874 14.7001 8.70005 14.7001C8.46135 14.7001 8.23244 14.6053 8.06365 14.4365C7.89487 14.2678 7.80005 14.0388 7.80005 13.8001C7.80005 13.5615 7.89487 13.3325 8.06365 13.1638C8.23244 12.995 8.46135 12.9001 8.70005 12.9001C8.93874 12.9001 9.16766 12.995 9.33645 13.1638C9.50523 13.3325 9.60005 13.5615 9.60005 13.8001ZM8.70005 18.3001C8.93874 18.3001 9.16766 18.2053 9.33645 18.0365C9.50523 17.8678 9.60005 17.6388 9.60005 17.4001C9.60005 17.1615 9.50523 16.9325 9.33645 16.7638C9.16766 16.595 8.93874 16.5001 8.70005 16.5001C8.46135 16.5001 8.23244 16.595 8.06365 16.7638C7.89487 16.9325 7.80005 17.1615 7.80005 17.4001C7.80005 17.6388 7.89487 17.8678 8.06365 18.0365C8.23244 18.2053 8.46135 18.3001 8.70005 18.3001ZM8.50205 3.60015C8.62618 3.24905 8.85615 2.9451 9.16026 2.73018C9.46437 2.51526 9.82766 2.39995 10.2 2.40015H13.8C14.1724 2.39995 14.5357 2.51526 14.8398 2.73018C15.144 2.9451 15.3739 3.24905 15.498 3.60015H17.4C17.8774 3.60015 18.3353 3.78979 18.6728 4.12735C19.0104 4.46492 19.2 4.92276 19.2 5.40015V19.8001C19.2 20.2775 19.0104 20.7354 18.6728 21.0729C18.3353 21.4105 17.8774 21.6001 17.4 21.6001H6.60005C6.12266 21.6001 5.66482 21.4105 5.32726 21.0729C4.98969 20.7354 4.80005 20.2775 4.80005 19.8001V5.40015C4.80005 4.92276 4.98969 4.46492 5.32726 4.12735C5.66482 3.78979 6.12266 3.60015 6.60005 3.60015H8.50205ZM10.2 3.60015C10.0409 3.60015 9.88831 3.66336 9.77578 3.77588C9.66326 3.8884 9.60005 4.04102 9.60005 4.20015C9.60005 4.35928 9.66326 4.51189 9.77578 4.62441C9.88831 4.73693 10.0409 4.80015 10.2 4.80015H13.8C13.9592 4.80015 14.1118 4.73693 14.2243 4.62441C14.3368 4.51189 14.4 4.35928 14.4 4.20015C14.4 4.04102 14.3368 3.8884 14.2243 3.77588C14.1118 3.66336 13.9592 3.60015 13.8 3.60015H10.2ZM8.50205 4.80015H6.60005C6.44092 4.80015 6.28831 4.86336 6.17578 4.97588C6.06326 5.0884 6.00005 5.24102 6.00005 5.40015V19.8001C6.00005 19.9593 6.06326 20.1119 6.17578 20.2244C6.28831 20.3369 6.44092 20.4001 6.60005 20.4001H17.4C17.5592 20.4001 17.7118 20.3369 17.8243 20.2244C17.9368 20.1119 18 19.9593 18 19.8001V5.40015C18 5.24102 17.9368 5.0884 17.8243 4.97588C17.7118 4.86336 17.5592 4.80015 17.4 4.80015H15.498C15.3739 5.15124 15.144 5.45519 14.8398 5.67011C14.5357 5.88503 14.1724 6.00034 13.8 6.00015H10.2C9.82766 6.00034 9.46437 5.88503 9.16026 5.67011C8.85615 5.45519 8.62618 5.15124 8.50205 4.80015Z" fill="#3697F2" />
            </svg>}>이용약관</Button></div>

        </div>
      </div>
    </div>

  );
};

export default MyPageForm;
