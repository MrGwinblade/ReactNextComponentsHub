import { authOptions } from '@/constants/auth-constants';
import { getServerSession } from 'next-auth';


export const getUserSession = async () => {
  const session = await getServerSession(authOptions);

  return session?.user ?? null;
};
