import Header from '@/components/common/Header';
import NavigationBar from '@/components/common/NavigationBar';
import { ModalProvider } from '@/providers/modal.context';
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
            <ModalProvider>
              <Header />
              <NavigationBar />
              <div className="pt-12 pb-16 h-auto md:pt-12 md:mb-0 md:pb-0">{children}</div>
            </ModalProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
