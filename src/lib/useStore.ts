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
}));

export default useStore;