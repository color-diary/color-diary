"use client"
import { createClient } from '@/utils/supabase/client';
import zustandStore, { loginZustandStore } from '@/zustand/zustandStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GiSoundOn } from "react-icons/gi";
import { GiSoundOff } from "react-icons/gi";

const Header = () => {
  const [audio] = useState(new Audio('/background-bgm.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [userStatus, setUserStatus] = useState(false);
  const isLogin = loginZustandStore(state => state.isLogin);
  const setIsLogin = loginZustandStore(state => state.setIsLogin);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log('헤더 로그=>', data.user);
      console.log(isLogin);
      if (data.user == null) {
        setUserStatus(false);
      } else {
        setUserStatus(true);
      }
    }
    checkUser();
  }, [])

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-[#CECECE]">
      <div className="flex-1"></div>
      <Link href={"/"}>
        <h1>Color inside</h1>
      </Link>
      <div className="flex space-x-4 flex-1 justify-end">
        <button onClick={toggleMusic}>
          {isPlaying ? <GiSoundOn size={24} /> : <GiSoundOff size={24} />}
        </button>
        {isLogin && (
          <Link href={"/my-page"}>
            <button>테스트 마이페이지</button>
          </Link>
        )}
        {!isLogin && (
          <Link href={"/log-in"}>
            <button>로그인</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
