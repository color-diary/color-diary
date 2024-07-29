"use client"
import { createClient } from '@/utils/supabase/client'
import { loginZustandStore } from '@/zustand/zustandStore';

import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const MyPageForm = () => {
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const publicSetProfileImg = loginZustandStore(state => state.publicSetProfileImg);
  const publicProfileImg = loginZustandStore(state => state.publicProfileImg)

  const setIsLogin = loginZustandStore(state => state.setIsLogin);
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
          // publicSetProfileImg(userData[0].profileImg || '/default-profile.jpg');
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
        router.replace('/');
      }
    } catch (error: unknown) {
      console.error('에러메세지=> ', error);
      if (axios.isAxiosError(error) && error.response) alert(error?.response.data.message);
      console.error(error);
      console.log('로그아웃 실패');
    }
  };

  // 이미지 업로드
  const addImgFile = async (file: File) => {
    try {
      const newFileName = `${Date.now()}.jpg`;
      const { data, error } = await supabase.storage.from('profileImg').upload(`${newFileName}`, file);
      if (error) {
        console.error(error);
        return;
      }
      const res = supabase.storage.from('profileImg').getPublicUrl(newFileName);
      console.log(res.data.publicUrl);
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
    <div className="flex flex-col items-center justify-center mt-[270px]">
      <div className="w-[1000px] flex flex-row items-center border-b-4">
        <Image
          src={profileImg || '/default-profile.jpg'}
          alt="Profile Image"
          width={150}
          height={150}
          className="rounded-full cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => { if (e.target.files) { addImgFile(e.target.files[0]) } }}
          className="hidden"
        />
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center">
            <span className="mr-2">닉네임:</span>
            <span>{nickname}</span>
          </div>

          <div className="flex items-center">
            <span className="mr-2">비밀번호:</span>
            <span>********</span>
          </div>

          {/* 닉네임 수정 input */}
          {/* <div className="flex items-center mt-4">
            <input
              type="text"
              onChange={(e) => setNewNickname(e.target.value)}
              value={newNickname}
              className="border rounded p-2 w-full"
            />
          </div> */}

          <button onClick={changeNicknameHandler} className="mt-4 border-4">정보 수정</button>
        </div>
      </div>
      {/* 선 아래 버튼3개 */}
      <div className="mt-4">
      <button className=' border-4' onClick={logoutHandler} >로그아웃</button>
      <button className=' border-4'>문의하기</button>
      <button className=' border-4'>이용약관</button>
      </div>
    </div>
  );
};

export default MyPageForm;
