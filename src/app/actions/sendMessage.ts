// app/actions/sendMessage.ts
'use server';

import { prisma } from '@@/prisma/prisma-client';

export async function SendMessage(chatId: number, senderId: number, content: string) {
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
      createdAt: new Date(),
      status: 'DELIVERED',
    },
    include: {
      sender: { select: { fullName: true, avatarUrl: true } },
    },
  });

  console.log('Сообщение создано:', message);

  // Отправка через API на WebSocket-сервер
  await fetch('http://localhost:4000/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId: message.chatId,
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: message.sender,
      status: message.status,
      replyToId: message.replyToId,
    }),
  });

  return { status: 'success', message };
}