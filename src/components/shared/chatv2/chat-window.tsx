'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useStore from '@/lib/useStore';
import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/components/ui';
import { Send } from 'lucide-react';

interface ChatWindowProps {
  selectedChat: number | null;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat, className }) => {
  const { data: session } = useSession();
  const { chats, messages, setMessages } = useStore();
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

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  if (!session) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      {selectedChat ? (
        <>
          <div className="p-4 border-b border-l border-zinc-600 bg-[#0f1621] text-slate-200">
            <h2 className="text-lg font-semibold">
              {
                chats.find((c) => c.id === selectedChat)?.participants.find(
                  (p) => p.userId !== session.user.id
                )?.user.fullName || 'Chat'
              }
            </h2>
          </div>
          <div className="flex-1 border-l border-zinc-600 overflow-y-auto p-4 bg-[#0f1621]">
            {messages
              .filter((msg) => msg.chatId === selectedChat)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${msg.senderId === session.user.id ? '' : 'text-right'}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-md ${
                      msg.senderId === session.user.id
                        ? 'bg-white border text-slate-950'
                        : 'bg-blue-500 text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
          </div>
          {/* Закрепленный инпут */}
          <div className="p-4 border-t border-l border-zinc-600 bg-[#223041]">
            <div className="flex gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown ={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
                placeholder="Type a message..."
              />
              <div className='bg-blue-500 rounded-r rounded-l'> 
                <Send
                onClick={handleSend}
                className='mt-1 cursor-pointer h-7 w-8'
              >
                Send
              </Send></div>
             
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
