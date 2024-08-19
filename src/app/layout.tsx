import ChannelTalk from '@/components/common/ChannelTalk';
import Header from '@/components/common/Header';
import Landing from '@/components/common/Landing';
import NavigationBar from '@/components/common/NavigationBar';
import { ModalProvider } from '@/providers/modal.context';
import QueryProvider from '@/providers/ReactQueryClientProvider';
import { ToastProvider } from '@/providers/toast.context';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Color Inside',
  description: 'coloring your feeling',
  icons: {
    icon: '/icon.svg'
  }
};

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard'
});

export default function RootLayout({ children }: { children: PropsWithChildren }) {
  return (
    <html lang="en">
      <head>
        <script src="https://developers.kakao.com/sdk/js/kakao.js" async></script>
      </head>
      <body className={`${pretendard.variable} font-pretendard`}>
        <QueryProvider>
          <ToastProvider>
            <ModalProvider>
              <Header />
              <NavigationBar />
              <ChannelTalk />
              <Landing>
                <div className="pt-12 pb-16 h-auto md:pt-0 md:pb-0">{children}</div>
              </Landing>
            </ModalProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
