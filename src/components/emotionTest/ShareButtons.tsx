'use client';

import { useToast } from '@/providers/toast.context';
import { useEffect } from 'react';
import KakaoIcon from './assets/KakaoIcon';
import LinkIcon from './assets/LinkIcon';
import ShareIcon from './assets/ShareIcon';

interface ShareButtonsProps {
  emotion: string;
}

const ShareButtons = ({ emotion }: ShareButtonsProps) => {
  const toast = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }
  }, []);

  const shareOnKakao = (): void => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: 'Color Inside 오늘 당신의 감정의 색은?',
          description: `#오늘_나는_${emotion.slice(1, 3)} #너는_어때?`,
          imageUrl: 'https://ngnwhcimrvjbniipoibl.supabase.co/storage/v1/object/public/thumbnail/image.png',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href
          }
        },
        buttons: [
          {
            title: '감정 테스트 하러 가기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href
            }
          }
        ]
      });
    } else {
      toast.on({ label: '공유에 실패했습니다.' });
    }
  };

  const shareOnLink = async (): Promise<void> => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.on({ label: '링크 복사가 완료되었어요. 주변 사람들에게 공유해봐요!' });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8px-col-m md:gap-24px-col">
      <div className="flex justify-center items-center gap-8px-row-m md:gap-8px-row">
        <h3 className="text-font-color text-14px-m md:text-18px font-medium tracking-0.28px md:tracking-0.36px">
          나의 감정 공유하기
        </h3>
        <span className="flex items-center justify-center w-6 h-6 md:w-24px-row md:h-24px-col">
          <ShareIcon />
        </span>
      </div>
      <div className="flex items-center gap-16px-row-m md:gap-16px-row">
        <button
          onClick={shareOnKakao}
          className="flex items-center justify-center w-11 h-11 md:w-44px-row md:h-44px-col"
        >
          <KakaoIcon />
        </button>
        <button
          onClick={shareOnLink}
          className="flex items-center justify-center w-11 h-11 md:w-44px-row md:h-44px-col"
        >
          <LinkIcon />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
