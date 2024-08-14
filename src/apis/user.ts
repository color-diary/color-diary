import { User } from '@supabase/supabase-js';
import axios from 'axios';

export const fetchUser = async (): Promise<User> => {
  const {
    data: { user }
  } = await axios.get('/api/auth/me');

  return user;
};
