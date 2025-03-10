import { authOptions } from '@/constants/auth-constants';
import NextAuth from 'next-auth';


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
