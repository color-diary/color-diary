"use client"
import { createClient } from '@/utils/supabase/client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const MyPageForm = () => {
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const nicknameData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const { data: userData } = await supabase.from('users').select('nickname').eq('id', data.user?.id);
        console.log('userData => ', userData);
        if (userData) {
          const userNickname = userData[0].nickname;
          setNickname(userNickname);
          setNewNickname(userNickname);
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
      console.log(error);
    }
  }
  
  // 이미지 업로드


  const logoutHandler = async () => {
    const response = await axios.delete("/api/auth/log-out");
    try {
      if (response.status === 200) {
        alert(response.data.message);
        console.log('로그아웃 성공');
        router.replace('/log-in');
      }
    } catch (error: unknown) {
      console.log('에러메세지=> ', error);
      if (axios.isAxiosError(error) && error.response)
        alert(error?.response.data.message);
      console.error(error);
      console.log('로그아웃 실패');
    }
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <button className='border-2 border-red-500' onClick={logoutHandler}>로그아웃</button>
      <h1>{`현재 로그인된 닉네임=> ${nickname}`}</h1>
      <input
        type="text"
        onChange={(e) => setNewNickname(e.target.value)}
        value={newNickname}
        className='border-2 border-red-500'
      />
      <div>
      <button className='border-2 border-red-500' onClick={changeNicknameHandler}>닉네임 수정</button>
      </div>
      {/* 이미지 업로드 + 보여지는 곳 */}
      <input type="file" />
      <img src="" alt="" />
    </div>
  );
}

export default MyPageForm;
