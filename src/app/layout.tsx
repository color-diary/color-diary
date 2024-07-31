import Header from '@/components/common/Header';
import SideBar from '@/components/common/Sidebar';
import QueryProvider from '@/providers/ReactQueryClientProvider';
import { ToastProvider } from '@/providers/toast.context';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://developers.kakao.com/sdk/js/kakao.js" async></script>
      </head>
      <body className={`${pretendard.variable} font-pretendard`}>
        <QueryProvider>
          <ToastProvider>
            <Header />
            {/* <SideBar /> */}
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
