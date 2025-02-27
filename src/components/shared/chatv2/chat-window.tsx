'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useStore from '@/lib/useStore';
import { cn } from '@/shared/lib/utils';
import { Input } from '@/components/ui';
import { Send } from 'lucide-react';
import { notifyMessageDeleted } from '@/lib/notify';
import { MessageItem } from './message';



interface ChatWindowProps {
  selectedChat: number | null;
  className?: string;
}





export const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat, className }) => {
  const { data: session } = useSession();
  const { chats, messages, setMessages, removeMessage } = useStore();
  const [message, setMessage] = useState('');

  const fetchMessages = async (chatId: number) => {
    try {
      const res = await fetch(`/api/messages?chatId=${chatId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!message || !selectedChat) return;

    const newMessage = {
      chatId: selectedChat,
      content: message,
      sender: {
        fullName: session?.user?.fullName || '',
        avatarUrl: session?.user?.image || null,
      },
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const res = await fetch(`/api/messages?messageId=${messageId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete message');
      const message = messages.find((msg) => msg.id === messageId);
      if (message) {
        await notifyMessageDeleted({
          chatId: message.chatId,
          messageId: message.id,
        });
      }
      removeMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat);
  }, [selectedChat]);

  if (!session) return null;

  return (
    <div className={cn('flex flex-col', className)}>
      {selectedChat ? (
        <>
          <div className="p-4 border-b border-l border-zinc-600 bg-[#0f1621] text-slate-200">
            <h2 className="text-lg font-semibold">
              {chats.find((c) => c.id === selectedChat)?.participants.find(
                (p) => p.userId !== session.user.id
              )?.user.fullName || 'Chat'}
            </h2>
          </div>
          <div className="flex-1 border-l border-zinc-600 overflow-y-auto p-4 bg-[#0f1621]">
            {messages
              .filter((msg) => msg.chatId === selectedChat)
              .map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  userId={session.user.id}
                  onDelete={handleDeleteMessage}
                />
              ))}
          </div>
          <div className="p-4 border-t border-l border-zinc-600 bg-[#223041]">
            <div className="flex gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
                placeholder="Type a message..."
              />
              <div className="bg-blue-500 rounded-r rounded-l">
                <Send
                  onClick={handleSend}
                  className="mt-1 cursor-pointer h-7 w-8"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-200">
          <p>Select a chat or search for a user to start messaging</p>
        </div>
      )}
    </div>
  );
};