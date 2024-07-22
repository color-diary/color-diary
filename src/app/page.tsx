'use client';

import axios from 'axios';
import { useEffect } from 'react';

export default function MainPage() {
  useEffect(() => {
    const test = async () => {
      const urlToFile = async (url: string): Promise<File> => {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = url.split('/').slice(-1)[0];
        const extension = filename.split('.').slice(-1)[0];
        const metadata = { type: `image/${extension}` };
        return new File([blob], filename, metadata);
      };

      const file = await urlToFile(
        'https://ngnwhcimrvjbniipoibl.supabase.co/storage/v1/object/public/diaries/test.jpg'
      );

      const formData = new FormData();
      formData.append('userId', crypto.randomUUID());
      formData.append('color', '#FFD400');
      formData.append('tags', JSON.stringify(['행복', '감동']));
      formData.append('content', '즐거운 하루였다.');
      formData.append('img', file);
      formData.append('date', new Date().toISOString());

      await axios.post('/api/diaries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };

    test();
  }, []);

  return <main>컬러인사이드 화이팅</main>;
}
