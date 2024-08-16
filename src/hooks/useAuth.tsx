'use client';

import { fetchUser } from '@/apis/user';
import { useQuery } from '@tanstack/react-query';

const useAuth = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser
  });

  return { user, isLoading };
};

export default useAuth;