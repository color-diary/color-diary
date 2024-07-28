'use client';

import { useToast } from '@/providers/toast.context';
import { useEffect } from 'react';

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
          description: `#오늘_나는_${emotion}`,
          imageUrl: 'IMAGE_URL',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href
          }
        },
        buttons: [
          {
            title: '감정 테스트하러 가기',
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
    <div>
      <h3>나의 감정 공유하기</h3>
      <div>
        <button onClick={shareOnKakao}>카카오톡</button>
        <button onClick={shareOnLink}>링크 공유</button>
      </div>
    </div>
  );
};

export default ShareButtons;
