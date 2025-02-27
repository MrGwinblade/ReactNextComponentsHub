import { create } from 'zustand';

type Message = {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: Date;
  sender: { fullName: string; avatarUrl: string | null };
};

type Chat = {
  id: number;
  name?: string;
  type: string;
  participants: { userId: number; user: { id: number; fullName: string } }[];
};

type Store = {
  chats: Chat[];
  messages: Message[];
  setChats: (chats: Chat[]) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  removeChat: (chatId: number) => void;
  removeMessage: (messageId: number) => void;
};

const useStore = create<Store>((set) => ({
  chats: [],
  messages: [],
  setChats: (chats) => set({ chats }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.filter((m) => m.id !== message.id), message],
    })),
  setMessages: (messages) => set({ messages }),
  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
      messages: state.messages.filter((msg) => msg.chatId !== chatId),
    })),
  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    })),
}));

export default useStore;