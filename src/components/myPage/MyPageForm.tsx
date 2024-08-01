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
  const [profileImg, setProfileImg] = useState('/default-profile.jpg');
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const publicSetProfileImg = loginZustandStore(state => state.publicSetProfileImg);
  const publicProfileImg = loginZustandStore(state => state.publicProfileImg)
  const setIsLogin = loginZustandStore(state => state.setIsLogin);
  const isLogin = loginZustandStore(state => state.isLogin);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

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

  const changeNicknameHandler = async () => {
    if (!validateNickname(newNickname)) {
      alert('닉네임은 3글자 이상이어야 합니다.');
      return;
    }

    try {
      const { data: userInfo } = await supabase.auth.getUser();
      if (userInfo.user) {
        const userId = userInfo.user.id;
        const { data, error } = await supabase.from('users').update({ nickname: newNickname }).eq('id', userId);
        if (!error) {
          setNickname(newNickname);
          setIsNicknameEditing(false);
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
        setIsLogin(false);
        publicSetProfileImg('');
        router.replace('/');
      }
    } catch (error) {
      console.error('에러메세지=> ', error);
      if (axios.isAxiosError(error) && error.response) alert(error?.response.data.message);
      console.error(error);
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
    <div className='flex flex-col items-center justify-center min-h-screen px-[140px]'>
      <div className='flex flex-col w-full max-w-[1128px] border-b-2 pb-10 border-black'>
        <div className='flex flex-col md:flex-row items-center px-4 py-4'>
          {isLogin ? (
            <div className='w-full max-w-[195px] flex-shrink-0'>
              <Image
                src={profileImg}
                alt="Profile Image"
                layout="responsive"
                width={195}
                height={195}
                className="rounded-full cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
            </div>
          ) : (
            <div className='w-full max-w-[195px] flex-shrink-0'>
              <Image
                src={"/default-profile.jpg"}
                alt="defaultProfile Image"
                layout="responsive"
                width={195}
                height={195}
                className="rounded-full"
              />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => { if (e.target.files) { addImgFile(e.target.files[0]) } }}
            className="hidden"
          />
          {/* 정보 폼 */}
          <div className='flex flex-col flex-grow ml-20 w-full'>
            <div className='text-22px flex items-center'>
             
              {isLogin ? (
                isNicknameEditing ? (
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className=' border-2 rounded-md border-black ml-2'
                  />
                ) : (
                  <div>
                  <span>닉네임: </span>
                  <span className='text-22 ml-2'>{nickname}</span>
                  </div>
                )
              ) : (
                <div className='mb-[120px]'>
                  <span>닉네임: </span>
                <span className='text-22 ml-2 '>비회원</span>
                </div>
              )}
            </div>
            {/* 정보수정 버튼 */}
            {isLogin && (
              <div className="mt-[72px]">
                {isNicknameEditing ? (
                  <Button onClick={changeNicknameHandler}>변경 저장</Button>
                ) : (
                  <Button onClick={() => setIsNicknameEditing(true)}>정보 수정</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 비회원 버튼 영역 */}
      {!isLogin && (
        <div className='flex flex-col w-full max-w-[1128px] mt-6'>
          <div className='flex justify-between'>
            <Button href={"/log-in"} priority="primary" size="lg" >회원가입</Button>
            <div className='flex gap-4'>
              <Button priority="tertiary" size="lg">문의하기</Button>
              <Button priority="tertiary" size="lg">이용약관</Button>
            </div>
          </div>
        </div>
      )}
      {/* 회원 버튼 영역 */}
      {isLogin && (
        <div className='flex flex-col w-full max-w-[1128px] mt-6'>
          <div className='flex justify-between'>
            <Button priority="secondary" size="lg" onClick={logoutHandler}>로그아웃</Button>
            <div className='flex gap-4'>
              <Button priority="tertiary" size="lg">문의하기</Button>
              <Button priority="tertiary" size="lg">이용약관</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageForm;
