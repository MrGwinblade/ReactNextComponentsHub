// src/lib/chatStore.ts
import { create } from 'zustand';
import { ChatData } from '@/app/actions/chat';

interface ChatState {
  chats: { chat: ChatData }[];
  selectedChatId: number | null;
  setChats: (chats: { chat: ChatData }[]) => void;
  addMessage: (chatId: number, message: ChatData['messages'][number]) => void;
  prependMessages: (chatId: number, messages: ChatData['messages']) => void;
  deleteMessage: (messageId: number) => void;
  selectChat: (chatId: number | null) => void;
  loadMoreMessages: (chatId: number, messages: ChatData['messages']) => void; // Новый метод
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedChatId: null,
  setChats: (chats) => set({ chats }),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chatData) =>
        chatData.chat.id === chatId
          ? { ...chatData, chat: { ...chatData.chat, messages: [...chatData.chat.messages, message] } }
          : chatData
      ),
    })),
  prependMessages: (chatId, messages) =>
    set((state) => ({
      chats: state.chats.map((chatData) =>
        chatData.chat.id === chatId
          ? {
              ...chatData,
              chat: { ...chatData.chat, messages: [...messages, ...chatData.chat.messages] },
            }
          : chatData
      ),
    })),
  deleteMessage: (messageId) =>
    set((state) => ({
      chats: state.chats.map((chatData) => ({
        ...chatData,
        chat: {
          ...chatData.chat,
          messages: chatData.chat.messages.filter((msg) => msg.id !== messageId),
        },
      })),
    })),
  selectChat: (chatId) => set({ selectedChatId: chatId }),
  loadMoreMessages: (chatId, messages) =>
    set((state) => ({
      chats: state.chats.map((chatData) =>
        chatData.chat.id === chatId
          ? {
              ...chatData,
              chat: {
                ...chatData.chat,
                messages: [
                  ...messages.filter(
                    (msg) => !chatData.chat.messages.some((m) => m.id === msg.id)
                  ), // Убираем дубли
                  ...chatData.chat.messages,
                ],
              },
            }
          : chatData
      ),
    })),
}));