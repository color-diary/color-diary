"use client"
import { createClient } from '@/utils/supabase/client';
import zustandStore, { loginZustandStore } from '@/zustand/zustandStore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GiSoundOn } from "react-icons/gi";
import { GiSoundOff } from "react-icons/gi";

const Header = () => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isLogin = loginZustandStore(state => state.isLogin);
    const setIsLogin = loginZustandStore(state => state.setIsLogin);
    const publicProfileImg = loginZustandStore(state => state.publicProfileImg)
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            console.log('헤더 로그=>', data.user);
            if (data.user == null) {
                setIsLogin(false);
            } else {
                setIsLogin(true);
            }
        }
        checkUser();
    }, []);

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
        <div className="flex justify-between items-center p-4 h-[72px] border-b-[1px] border-[#000000]">
            <div className="flex-1"></div>
            <Link href={"/"}>
                <Image
                    src="/logo.png"
                    alt="logo Image"
                    width={174}
                    height={56}
                    className="cursor-pointer"
                />
            </Link>
            <div className="flex space-x-4 flex-1 justify-end">
                <div className='flex space-x-4 mr-[20px] w-[76px] h-[40px]'>
                <button onClick={toggleMusic}>
                    {isPlaying ? <GiSoundOn size={24} /> : <GiSoundOff size={24} />}
                </button>

                {!isLogin ?
                    <Link href={"/log-in"}>
                        <button>로그인</button>
                    </Link>
                    : null}

                {/* 프로필 이미지가 들어갈곳 */}
                {isLogin ?
                    <Link href={"my-page"}>
                        <Image
                            src={publicProfileImg || "/default-profile.jpg"}
                            alt="Profile Image"
                            width={40}
                            height={40}
                            className="rounded-full cursor-pointer"
                        />
                    </Link> : null
                }
                </div>
            </div>
        </div>
    );
};

export default Header;
