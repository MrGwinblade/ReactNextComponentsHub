'use server'
// services/searchService.ts
import { PrismaClient } from "@prisma/client";
import { ChatData } from "@/app/actions/chat";

const prisma = new PrismaClient();

export const searchUsersOrChats = async (searchValue: string, chats: ChatData[]): Promise<ChatData[]> => {
  const trimmedSearch = searchValue.trim().toLowerCase();

  if (!trimmedSearch) return [];

  if (trimmedSearch.startsWith("@")) {
    const username = trimmedSearch.slice(1); // убираем @

    // Сначала ищем в существующих чатах
    const foundChat = chats.find((chat) => chat?.name?.toLowerCase() === username);
    if (foundChat) return [foundChat];

    // Если чата нет, ищем пользователя в базе
    const foundUser = await prisma.user.findFirst({
      where: { fullName: { equals: username, mode: "insensitive" } },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    if (foundUser) {
      // Создаем "виртуальный" чат для этого пользователя
      const virtualChat: ChatData = {
        id: -foundUser.id, // Отрицательный ID как индикатор виртуального чата
        name: foundUser.fullName,
        type: "private", // Предполагаем, что это приватный чат
        createdAt: new Date(),
        participants: [
          { id: foundUser.id, fullName: foundUser.fullName, avatarUrl: foundUser.avatarUrl },
        ],
        messages: [],
      };
      return [virtualChat];
    }
  }

  // Обычный поиск по чатам
  return chats.filter((chat) => chat?.name?.toLowerCase().includes(trimmedSearch) || false);
};