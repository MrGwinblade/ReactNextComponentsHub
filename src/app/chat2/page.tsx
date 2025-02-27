'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import io, {Socket } from 'socket.io-client';
import useStore from '@/lib/useStore';
import { ChatList } from '@/components/shared/chatv2/chat-list';
import { ChatWindow } from '@/components/shared/chatv2/chat-window';
import { Button } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface SocketMessage {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string | Date;
  sender: { fullName: string; avatarUrl: string | null };
  status: string;
}

const socket = io('http://localhost:4000');

export default function ChatPage() {
  const { data: session } = useSession();
  const { addMessage, removeMessage } = useStore();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    socket.emit('joinChats', session.user.id);

    const handleNewMessage = (msg: SocketMessage) => {
      const formattedMsg = {
        ...msg,
        createdAt: typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt,
      };
      addMessage(formattedMsg);
    };

    const handleMessageDeleted = ({ messageId }: { messageId: number }) => {
      removeMessage(messageId);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [session?.user?.id]);

  const handleSelectChat = (chatId: number) => {
    setSelectedChat(chatId);
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-[#223041] font-sans">
      <div className="flex flex-col min-w-[382px]">
        <div className="flex items-center gap-4 p-2 h-[61px] flex-shrink-0 border-b border-zinc-600">
          <Link href="/?component=profileButton">
            <Button variant="ghost" size="icon">
              <ChevronLeft />
            </Button>
          </Link>
          <h1 className="text-xl text-slate-200 font-semibold">Messages</h1>
        </div>
        <ChatList selectedChat={selectedChat} onSelectChat={handleSelectChat} className="bg-[#223041] flex flex-col" />
      </div>
      <ChatWindow selectedChat={selectedChat} className="flex-1 overflow-y-auto" />
    </div>
  );
}