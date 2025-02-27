'use server'

// services/searchService.ts
import { PrismaClient } from "@prisma/client";
import { Chat, ChatType, MessageStatus } from "@/@types/chat";
import { ChatData } from "@/app/actions/chat";

const prisma = new PrismaClient();

export const searchUsersOrChats = async (searchValue: string, chats: ChatData[]): Promise<ChatData[]> => {
  const trimmedSearch = searchValue.trim().toLowerCase();

  if (!trimmedSearch) return [];

  if (trimmedSearch.startsWith("@")) {
    const username = trimmedSearch.slice(1); // убираем @

    console.log(chats, "  chats");

    const foundChat = chats.find((chat) => chat?.name?.toLowerCase() === username);

    if (foundChat) return [foundChat];

    // Если чата нет, ищем юзера в базе
    setTimeout(() => {}, 4500);

        const foundUser = await prisma.user.findFirst({
            where: { fullName: { equals: username, mode: "insensitive" } },
            include: {
            chats: {
                include: {
                chat: {
                    include: {
                    messages: {
                        include: {
                        sender: true, // Включаем данные отправителя
                        attachments: true, // Включаем вложения
                        },
                        orderBy: {
                        createdAt: "desc", // Сортируем сообщения по дате (последнее сообщение первым)
                        },
                        take: 1, // Берем только последнее сообщение
                    },
                    participants: {
                        include: {
                        user: true, // Включаем данные участников
                        },
                    },
                    },
                },
                },
            },
            },
        });

        if (foundUser) {
           
    } else {
        // Обычный поиск только по чатам
        return chats.filter((chat) => chat?.name?.toLowerCase().includes(trimmedSearch));
    }
  }
  return [];
};
