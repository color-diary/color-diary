'use client';

import navigation from '@/data/navigation';
import { useModal } from '@/providers/modal.context';
import useZustandStore, { loginZustandStore } from '@/zustand/zustandStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HomeIcon from './assets/HomeIcon';
import KeyIconWhite from './assets/KeyIconWhite';

const NavigationBar = () => {
  const pathname = usePathname();

  const router = useRouter();
  const modal = useModal();

  const { setIsDiaryEditMode } = useZustandStore();
  const isLogin = loginZustandStore((state) => state.isLogin);

  const handleClickIcon = (): void => {
    setIsDiaryEditMode(false);
  };

  const goToHome = (): void => {
    modal.close();
    router.push('/');
  };

  const goToLogIn = (): void => {
    modal.close();
    router.push('/log-in');
  };

  const handleClickStatisticsIcon = (): void => {
    if (!isLogin) {
      modal.open({
        label: '회원만 이용할 수 있는 화면이에요./로그인을 하실 건가요?',
        onConfirm: goToHome,
        onCancel: goToLogIn,
        confirmButtonContent: {
          children: '홈으로 이동하기',
          icon: <HomeIcon />
        },
        cancelButtonContent: {
          children: '로그인 하러가기',
          icon: <KeyIconWhite />
        }
      });
    } else {
      handleClickIcon();
      router.push('/statistics');
    }
  };

  return (
    <aside className="z-10 fixed flex items-center bg-sign-up md:w-30 md:h-screen md:flex-col md:left-0 md:top-0 md:pt-32 md:px-6 w-full h-16 bottom-0 left-0 flex-row px-5 pt-1 border-t md:border-t-0 md:border-r rounded-t-2xl border-border-color md:rounded-none">
      <nav className="w-full">
        <ul className="flex md:flex-col md:justify-end md:items-start md:gap-4 flex-row justify-between items-end">
          {navigation.map((e) => {
            return pathname === e.path ? (
              <li key={e.name}>
                <Link
                  href={e.path}
                  onClick={handleClickIcon}
                  className="flex flex-col items-center justify-center md:w-18 md:h-18 gap-1 px-2 rounded-2xl md:shadow-inner-top-left md:bg-pick"
                >
                  <span className="md:w-9 md:h-9 w-6 h-6">{e.fill}</span>
                  <span className="text-font-color text-sm font-normal tracking-0.28px">{e.name}</span>
                </Link>
              </li>
            ) : (
              <li key={e.name}>
                {e.path === '/statistics' ? (
                  <button
                    onClick={handleClickStatisticsIcon}
                    className="flex flex-col items-center justify-center md:w-18 md:h-18 gap-1 px-2"
                  >
                    <span className="md:w-9 md:h-9 w-6 h-6">{e.outLine}</span>
                    <span className="text-font-color text-sm font-normal tracking-0.28px">{e.name}</span>
                  </button>
                ) : (
                  <Link
                    href={e.path}
                    onClick={handleClickIcon}
                    className="flex flex-col items-center justify-center md:w-18 md:h-18 gap-1 px-2"
                  >
                    <span className="md:w-9 md:h-9 w-6 h-6">{e.outLine}</span>
                    <span className="text-font-color text-sm font-normal tracking-0.28px">{e.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default NavigationBar;
