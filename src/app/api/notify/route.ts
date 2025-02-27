// app/api/notify/route.ts
'use server';

import { notifyNewMessage } from 'C:/Users/MrGwin/nodejsServer/server'; // Это временно, замените на HTTP-запрос

export async function POST(req: Request) {
  const message = await req.json();
  await notifyNewMessage(message);
  return new Response('Сообщение отправлено', { status: 200 });
}