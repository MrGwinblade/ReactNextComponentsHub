// app/actions/chat.ts
'use server';

import { prisma } from '@@/prisma/prisma-client';
import { Session } from 'next-auth';

export interface ChatResponse {
  status: 'success' | 'unauthorized' | 'user_not_found' | 'error';
  chats?: { chat: ChatData }[];
  error?: any;
}

export interface ChatData {
  id: number;
  name: string | null;
  type: string;
  createdAt: Date;
  participants: { id: number; fullName: string; avatarUrl: string | null }[];
  messages: {
    id: number;
    content: string;
    createdAt: Date;
    sender: { fullName: string; avatarUrl: string | null };
    status: string;
    replyToId: number | null;
  }[];
}

export async function GetCurrentUserSession(userSession: { data: Session | null; status: string }): Promise<ChatResponse> {
  const { data: session, status } = userSession;

  if (!session?.user?.fullName || status !== 'authenticated') {
    return { status: 'unauthorized' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { fullName: session.user.fullName },
      select: {
        id: true,
        fullName: true,
        chats: {
          include: {
            chat: {
              select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
                messages: {
                  orderBy: { createdAt: 'desc' }, // Сначала последние
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    sender: {
                      select: { fullName: true, avatarUrl: true },
                    },
                    status: true,
                    replyToId: true,
                  },
                },
                participants: {
                  select: {
                    user: {
                      select: { id: true, fullName: true, avatarUrl: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { status: 'user_not_found' };
    }

    const chats = user.chats.map((userChat) => {
      const chat = userChat.chat;
      return {
        chat: {
          id: chat.id,
          name: chat.name,
          type: chat.type,
          createdAt: chat.createdAt,
          participants: chat.participants.map((p) => p.user),
          messages: chat.messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            sender: msg.sender,
            status: msg.status,
            replyToId: msg.replyToId,
          })).reverse(), // От старых к новым
        },
      };
    });

    return { status: 'success', chats };
  } catch (error) {
    console.error(error);
    return { status: 'error', error };
  }
}

// Оставляем GetMoreMessages для возможного будущего использования, но не используем сейчас
export async function GetMoreMessages(chatId: number, offset: number, limit: number = 10): Promise<{
  messages: ChatData['messages'];
  hasMore: boolean;
}> {
  const totalMessages = await prisma.message.count({
    where: { chatId },
  });

  console.log('Total messages in chat:', totalMessages, 'Offset:', offset);

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit,
    select: {
      id: true,
      content: true,
      createdAt: true,
      sender: {
        select: { fullName: true, avatarUrl: true },
      },
      status: true,
      replyToId: true,
    },
  });

  console.log('Loaded messages:', messages.length);

  return {
    messages: messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      sender: msg.sender,
      status: msg.status,
      replyToId: msg.replyToId,
    })).reverse(),
    hasMore: offset + messages.length < totalMessages,
  };
}

export async function DeleteMessage(messageId: number, userId: number) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { senderId: true, chatId: true },
  });

  if (!message) {
    throw new Error('Сообщение не найдено или вы не можете его удалить');
  }

  await prisma.message.delete({
    where: { id: messageId },
  });

  await fetch('http://localhost:4000/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId: message.chatId,
      messageId,
      action: 'delete',
    }),
  });

  return { status: 'success' };
}