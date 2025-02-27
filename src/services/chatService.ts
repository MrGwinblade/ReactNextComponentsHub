
// src/services/chatService.ts
import io from 'socket.io-client';
import { GetCurrentUserSession } from '@/app/actions/chat';
import { useChatStore } from '@/lib/chatStore';
import { toast } from 'sonner';

const socket = io('http://localhost:4000', {
  reconnection: true, // Автоматическое переподключение
  reconnectionAttempts: Infinity, // Бесконечные попытки
  reconnectionDelay: 2000, // Задержка между попытками 2 секунды
  transports: ['websocket'],
});

export interface SocketMessage {
  id: number;
  chatId: number;
  content: string;
  createdAt: Date;
  sender: { fullName: string; avatarUrl: string | null };
  status: string;
  replyToId: number | null;
}

export const initializeChatService = (userId: number, currentUserFullName: string) => {
  console.log('Инициализация WebSocket для userId:', userId);

  // Подключаемся и подписываемся на чаты
  socket.on('connect', () => {
    console.log('WebSocket подключён, socket.id:', socket.id);
    socket.emit('joinChats', userId); // Отправляем joinChats при каждом подключении
  });

  socket.on('reconnect', (attempt:number) => {
    console.log('Переподключение успешно, попытка:', attempt);
    socket.emit('joinChats', userId); // Повторная подписка после переподключения
  });

  socket.on('connect_error', (error: Error) => {
    console.error('Ошибка подключения WebSocket:', error);
  });

  socket.on('newMessage', (newMessage: SocketMessage) => {
    console.log('Получено новое сообщение через WebSocket:', newMessage);
    const { addMessage } = useChatStore.getState();
    addMessage(newMessage.chatId, newMessage);

    if (newMessage.sender.fullName !== currentUserFullName) {
      toast(`Новое сообщение от ${newMessage.sender.fullName}`, {
        description: newMessage.content,
        duration: 4000,
      });
      console.log('Показываем тост');
    }
  });

  socket.on('messageDeleted', ({ messageId }: { messageId: number }) => {
    console.log('Сообщение удалено:', messageId);
    const { deleteMessage } = useChatStore.getState();
    deleteMessage(messageId);
  });

  // Инициальная подписка, если уже подключены
  if (socket.connected) {
    socket.emit('joinChats', userId);
  }

  return () => {
    socket.off('newMessage');
    socket.off('connect');
    socket.off('reconnect');
    socket.off('connect_error');
  };
};

export const fetchChats = async (session: any, status: string) => {
  const result = await GetCurrentUserSession({ data: session, status });
  if (result.status === 'success') {
    useChatStore.getState().setChats(result.chats || []);
  }
  return result;
};

export const sendMessage = async (chatId: number, senderId: number, content: string) => {
  console.log('sendMessage вызван:', { chatId, senderId, content });
  const { SendMessage } = await import('@/app/actions/sendMessage');
  await SendMessage(chatId, senderId, content);
};
