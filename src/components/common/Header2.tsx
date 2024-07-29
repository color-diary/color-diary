"use client"
import { createClient } from '@/utils/supabase/client';
import zustandStore, { loginZustandStore } from '@/zustand/zustandStore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GiSoundOn } from "react-icons/gi";
import { GiSoundOff } from "react-icons/gi";

const Header2 = () => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    const isLogin = loginZustandStore(state => state.isLogin);
    const setIsLogin = loginZustandStore(state => state.setIsLogin);
    const publicProfileImg = loginZustandStore(state => state.publicProfileImg)
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
    }, []);

    useEffect(() => {
        setAudio(new Audio('/background-bgm.mp3'));
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
        <div className="flex justify-between items-center p-4 border-b-2">
            <div className="flex-1"></div>
            <Link href={"/"}>
                <Image
                    src="/logo.png"
                    alt="logo Image"
                    width={200}
                    height={200}
                    className="cursor-pointer"
                />
            </Link>
            <div className="flex space-x-4 flex-1 justify-end">
                <button onClick={toggleMusic}>
                    {isPlaying ? <GiSoundOn size={24} /> : <GiSoundOff size={24} />}
                </button>

                {!isLogin && (
                    <Link href={"/log-in"}>
                        <button>로그인</button>
                    </Link>
                )}
                {/* 프로필 이미지가 들어갈곳 */}
                {isLogin && (
                    <Link href={"my-page"}>
                        <Image
                            src={publicProfileImg}
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

export default Header2;
