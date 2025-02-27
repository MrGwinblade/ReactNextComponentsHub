'use server'

import { prisma } from '@@/prisma/prisma-client';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';


export async function GetCurrentUserSession(userSession: any) {
  const { data: session, status } = userSession;

  if (!session?.user?.fullName) {
    return { status: "unauthorized" }; // Пользователь не авторизован
  }

  try {
    // Находим пользователя в базе данных по имени
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
                  orderBy: {
                    createdAt: 'desc' // Сортировка сообщений по дате
                  },
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    sender: {
                      select: {
                        fullName: true,
                        avatarUrl: true
                      }
                    },
                    status: true,
                    replyToId: true,
                  },
                },
                participants: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return { status: "user_not_found" };
    }

    // Формируем массив чатов с необходимой информацией
    const chats = user.chats.map((userChat) => {
      const chat = userChat.chat;
      return {
        chat: {
          id: chat.id,
          name: chat.name,
          type: chat.type,
          createdAt: chat.createdAt,
          participants: chat.participants.map(p => p.user),
          messages: chat.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            sender: msg.sender,
            status: msg.status,
            replyToId: msg.replyToId,
          })),
        }
      };
    });

    return { status: "success", chats };

  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
}
