import { NextResponse } from 'next/server';
import { prisma } from '@@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/constants/auth-constants';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { participants: { some: { userId: Number(session.user.id) } } },
    include: { participants: { include: { user: true } } },
  });

  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { participantId } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      type: 'DIRECT',
      participants: {
        create: [
          { userId: Number(session.user.id) },
          { userId: participantId },
        ],
      },
    },
    include: { participants: { include: { user: true } } },
  });

  return NextResponse.json(chat);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
  }

  await prisma.chat.delete({
    where: { id: Number(chatId) },
  });

  return NextResponse.json({ success: true });
}