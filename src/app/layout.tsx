import QueryProvider from '@/providers/ReactQueryClientProvider';
import { ToastProvider } from '@/providers/toast.context';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SideBar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';



const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'color-inside',
  description: 'coloring your feeling'
};

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
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider>
            <Header />
            <SideBar />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
