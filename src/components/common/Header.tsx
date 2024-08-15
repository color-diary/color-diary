'use client';

import useAuth from '@/hooks/useAuth';
import useZustandStore, { loginZustandStore } from '@/zustand/zustandStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import TextButton from './TextButton';
import KeyIconGreen from './assets/KeyIconGreen';
import Logo from './assets/Logo';
import MusicOffIcon from './assets/MusicOffIcon';
import MusicOnIcon from './assets/MusicOnIcon';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const isLogin = loginZustandStore((state) => state.isLogin);
  const setIsLogin = loginZustandStore((state) => state.setIsLogin);
  const { setIsDiaryEditMode, setHasTestResult } = useZustandStore();

  const { data: userData } = useQuery({
    queryKey: ['information'],
    queryFn: async () => {
      const { data } = await axios.get('/api/auth/me/information');
      return data;
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['information', 'user'] });
  }, [user]);

  useEffect(() => {
    const checkUser = async () => {
      if (user == null) {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
    };
    checkUser();
  }, [isLogin]);

  useEffect(() => {
    const backGroundBgm: HTMLAudioElement = new Audio('/background-bgm.mp3');
    backGroundBgm.volume = 0.07;
    backGroundBgm.loop = true;
    setAudio(backGroundBgm);
  }, []);

  const handleClick = (): void => {
    setIsDiaryEditMode(false);
    setHasTestResult(false);
  };

  const toggleMusic = (): void => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="z-10 fixed top-0 left-0 w-full flex items-center py-1 md:py-2 h-12 md:h-18 shadow-header-shadow bg-layout px-5">
      <div className="flex md:hidden w-fit items-center">
        {pathname.startsWith('/diaries') || pathname === '/emotion-test' ? (
          <TextButton
            onClick={() => {
              handleClick();
              router.back();
            }}
          >
            뒤로 가기
          </TextButton>
        ) : (
          <Link
            href={'/'}
            className="flex items-center cursor-pointer justify-center md:w-43.5 md:h-14 w-25 h-7"
            onClick={handleClick}
          >
            <Logo />
          </Link>
        )}
      </div>
      <div className="hidden md:flex w-full justify-center items-center">
        <Link
          href={'/'}
          className="flex items-center cursor-pointer justify-center md:w-43.5 md:h-14 w-25 h-7"
          onClick={handleClick}
        >
          <Logo />
        </Link>
      </div>
      <div className="absolute right-0 flex items-center justify-end gap-3 md:mr-8 mr-5">
        <button onClick={toggleMusic} className="w-6 h-6">
          {isPlaying ? <MusicOnIcon /> : <MusicOffIcon />}
        </button>
        {isLogin && userData ? (
          <Link href={'/my-page'} onClick={handleClick}>
            <div className="relative md:w-10 md:h-10 w-6 h-6 aspect-square">
              <Image
                src={userData[0].profileImg || '/default-profile.jpg'}
                alt="Profile Image"
                fill
                className="rounded-full cursor-pointer object-cover"
              />
            </div>
          </Link>
        ) : (
          <Button onClick={handleClick} icon={<KeyIconGreen />} href={'/log-in'} priority="secondary" size={'mdFix'}>
            로그인
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
