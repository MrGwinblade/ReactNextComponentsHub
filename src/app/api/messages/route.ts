
import { NextResponse } from 'next/server';
import { useSession } from 'next-auth/react';
import { prisma } from '@@/prisma/prisma-client'; 
import { notifyNewMessage } from '../../../lib/notify';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/constants/auth-constants';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { chatId: Number(chatId) },
    include: { sender: true },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { chatId, content } = await req.json();

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: Number(session.user.id),
      content,
    },
    include: { sender: true },
  });

  await notifyNewMessage({
    chatId: message.chatId,
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    sender: {
      fullName: session.user.fullName || '',
      avatarUrl: session.user.image || null,
    },
    status: 'SENT',
  });

  return NextResponse.json(message);
}