'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const useCheckSession = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const { user } = data;
      return user;
    }
  });

  return { user: data, isLoading };
};

export default useCheckSession;
