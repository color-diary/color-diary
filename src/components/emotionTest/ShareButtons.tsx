'use client';

import { useEffect } from 'react';

interface ShareButtonsProps {
  emotion: string;
}

const ShareButtons = ({ emotion }: ShareButtonsProps) => {
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
      alert('공유를 실패하였습니다.');
    }
  };

  const shareOnLink = async (): Promise<void> => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다.');
  };

  return (
    <div>
      <h3>SNS에 내 결과 공유하기</h3>
      <div>
        <button onClick={shareOnKakao}>카카오톡</button>
        <button onClick={shareOnLink}>링크 공유</button>
      </div>
    </div>
  );
};

export default ShareButtons;
