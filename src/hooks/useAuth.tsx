'use client';

import { fetchUser } from '@/apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['information'] });
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [user]);

  return { user, isLoading };
};

export default useAuth;
