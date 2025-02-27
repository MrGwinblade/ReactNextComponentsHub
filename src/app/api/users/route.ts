
import { NextResponse } from 'next/server';
import { prisma } from '@@/prisma/prisma-client'; 
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/constants/auth-constants';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: Number(session.user.id) } },
        {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
    take: 10,
  });

  return NextResponse.json(users);
}