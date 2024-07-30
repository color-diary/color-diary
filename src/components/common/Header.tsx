"use client"
import { createClient } from '@/utils/supabase/client';
import zustandStore, { loginZustandStore } from '@/zustand/zustandStore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GiSoundOn, GiSoundOff } from "react-icons/gi";
import useZustandStore from '@/zustand/zustandStore';
import Button from '../common/Button';

const Header = () => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isLogin = loginZustandStore(state => state.isLogin);
    const setIsLogin = loginZustandStore(state => state.setIsLogin);
    const publicProfileImg = loginZustandStore(state => state.publicProfileImg);
    const supabase = createClient();
    const { setIsDiaryEditMode } = useZustandStore();

    const handleClick = () => {
        setIsDiaryEditMode(false);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data.user == null) {
                setIsLogin(false);
            } else {
                setIsLogin(true);
            }
        }
        checkUser();
    }, [setIsLogin, supabase]);

    useEffect(() => {
        const backGroundBgm: HTMLAudioElement = new Audio('/background-bgm.mp3');
        backGroundBgm.volume = 0.07;
        backGroundBgm.loop = true;
        setAudio(backGroundBgm);
    }, []);

    const toggleMusic = () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed top-0 w-full z-10 flex justify-between items-center h-[72px] border-b-[1px] border-[#e6d3bc] bg-white shadow">
            <div className="flex-1"></div>
            <Link href={"/"}
                onClick={handleClick}
            >
                <Image
                    src="/logo.png"
                    alt="logo Image"
                    width={158}
                    height={40}
                    className="cursor-pointer px-[8px]"
                />
            </Link>
            <div className="flex space-x-4 flex-1 justify-end items-center mr-[31px]">
                <button onClick={toggleMusic} className="w-[40px] h-[40px] flex justify-center items-center">
                    {isPlaying ? <GiSoundOn size={24} /> : <GiSoundOff size={24} />}
                </button>
                {!isLogin ? (
                        <Button  onClick={handleClick} href={"/log-in"} priority="secondary" icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6C15 6.26522 14.8946 6.51957 14.7071 6.70711C14.5196 6.89464 14.2652 7 14 7C13.7348 7 13.4804 6.89464 13.2929 6.70711C13.1054 6.51957 13 6.26522 13 6C13 5.73478 13.1054 5.48043 13.2929 5.29289C13.4804 5.10536 13.7348 5 14 5C14.2652 5 14.5196 5.10536 14.7071 5.29289C14.8946 5.48043 15 5.73478 15 6ZM12.5 2C9.424 2 7 4.424 7 7.5C7 7.897 7.04 8.296 7.122 8.675C7.18 8.945 7.114 9.179 6.98 9.313L2.44 13.853C2.30043 13.9924 2.18973 14.1579 2.11423 14.3402C2.03873 14.5224 1.99991 14.7177 2 14.915V16.5C2 16.8978 2.15804 17.2794 2.43934 17.5607C2.72064 17.842 3.10218 18 3.5 18H5.5C5.89783 18 6.27936 17.842 6.56066 17.5607C6.84196 17.2794 7 16.8978 7 16.5V16H8C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V14H10C10.2652 14 10.5196 13.8946 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13V12.82C11.493 12.954 12.007 13 12.5 13C15.576 13 18 10.576 18 7.5C18 4.424 15.576 2 12.5 2ZM8 7.5C8 4.976 9.976 3 12.5 3C15.024 3 17 4.976 17 7.5C17 10.024 15.024 12 12.5 12C11.84 12 11.227 11.905 10.724 11.653C10.6478 11.6148 10.563 11.5967 10.4779 11.6005C10.3927 11.6043 10.3099 11.6298 10.2373 11.6746C10.1648 11.7194 10.1049 11.782 10.0633 11.8564C10.0218 11.9309 10 12.0147 10 12.1V13H9C8.73478 13 8.48043 13.1054 8.29289 13.2929C8.10536 13.4804 8 13.7348 8 14V15H7C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16V16.5C6 16.6326 5.94732 16.7598 5.85355 16.8536C5.75979 16.9473 5.63261 17 5.5 17H3.5C3.36739 17 3.24022 16.9473 3.14645 16.8536C3.05268 16.7598 3 16.6326 3 16.5V14.914C3.00003 14.7816 3.05253 14.6547 3.146 14.561L7.687 10.02C8.119 9.588 8.209 8.976 8.099 8.464C8.03215 8.14705 7.99897 7.82392 8 7.5Z" fill="#25B18C" />
                        </svg>

                        }>로그인</Button>
                ) : (
                    <Link href={"/my-page"}
                        onClick={handleClick}>
                        <Image
                            src={publicProfileImg || "/default-profile.jpg"}
                            alt="Profile Image"
                            width={40}
                            height={40}
                            className="rounded-full cursor-pointer"
                        />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
