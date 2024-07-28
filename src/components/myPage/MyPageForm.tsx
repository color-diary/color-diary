'use client';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MyPageForm = () => {
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');

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
    <div>
      <h1>마이페이지</h1>
      <button className="border-2 border-red-500" onClick={logoutHandler}>
        로그아웃
      </button>
      <h1>{`현재 로그인된 닉네임=> ${nickname}`}</h1>
      <input
        type="text"
        onChange={(e) => setNewNickname(e.target.value)}
        value={newNickname}
        className="border-2 border-red-500"
      />
      <div>
        <button className="border-2 border-red-500" onClick={changeNicknameHandler}>
          닉네임 수정
        </button>
      </div>
      {/* 이미지 업로드 + 보여지는 곳 */}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            addImgFile(e.target.files[0]);
          }
        }}
      />
      <Image src={profileImg || '/default-profile.jpg'} alt="" width={100} height={100} />
    </div>
  );
};

export default MyPageForm;
