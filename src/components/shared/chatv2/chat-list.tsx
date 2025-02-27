'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useStore from '@/lib/useStore';
import { cn } from '@/shared/lib/utils';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';
import { Trash2 } from 'lucide-react';

interface ChatListProps {
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
  className?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ selectedChat, onSelectChat, className }) => {
  const { data: session } = useSession();
  const { chats, messages, setChats, removeChat } = useStore();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [openDeleteId, setOpenDeleteId] = useState<number | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: !!openDeleteId,
    onOpenChange: (open) => setOpenDeleteId(open ? openDeleteId : null),
    placement: 'right',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (!res.ok) throw new Error('Failed to fetch chats');
      const data = await res.json();
      if (Array.isArray(data)) setChats(data);
      else setChats([]);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  };

  const searchUsers = async () => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/users?search=${search}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const users = await res.json();
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const selectOrCreateChat = async (userId: number) => {
    const existingChat = chats.find((chat) =>
      chat.participants.some((p) => p.userId === userId && chat.type === 'DIRECT')
    );

    if (existingChat) {
      onSelectChat(existingChat.id);
    } else {
      try {
        const res = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantId: userId }),
        });
        if (!res.ok) throw new Error('Failed to create chat');
        const newChat = await res.json();
        setChats([...chats, newChat]);
        onSelectChat(newChat.id);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
    setSearch('');
    setSearchResults([]);
  };

  const handleDeleteChat = async (chatId: number) => {
    try {
      const res = await fetch(`/api/chats?chatId=${chatId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete chat');
      removeChat(chatId);
      if (selectedChat === chatId) onSelectChat(0);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
    setOpenDeleteId(null);
  };

  const getLastMessage = (chatId: number) => {
    const chatMessages = messages.filter((msg) => msg.chatId === chatId);
    return chatMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  useEffect(() => {
    if (session?.user?.id) fetchChats();
  }, [session?.user?.id]);

  useEffect(() => {
    searchUsers();
  }, [search]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className={cn('', className)}>
      <div id="SEARCH" className="p-4 border-b border-zinc-600">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchResults.length > 0 && (
          <div className="absolute bg-white border border-zinc-600 rounded mt-2 w-1/4 max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => selectOrCreateChat(user.id)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.fullName}
              </div>
            ))}
          </div>
        )}
      </div>
      <div id="CHATUSERS" className="flex-1 overflow-y-auto text-slate-200">
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((chat) => {
            const lastMessage = getLastMessage(chat.id);
            return (
              <div
                key={chat.id}
                className={`p-4 hover:bg-slate-700/40 cursor-pointer flex items-center justify-between ${
                  selectedChat === chat.id ? 'bg-[#151e29]' : ''
                }`}
              >
                <div className="flex-1" onClick={() => onSelectChat(chat.id)}>
                  <p className="font-medium">
                    {chat.name ||
                      chat.participants.find((p) => p.userId !== session.user.id)?.user.fullName ||
                      'Unknown User'}
                  </p>
                  {lastMessage && (
                    <div className="text-sm text-gray-400 truncate">
                      <span>{lastMessage.content}</span> ·{' '}
                      <span>{new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
                <div
                  ref={refs.setReference}
                  {...getReferenceProps()}
                  onClick={() => setOpenDeleteId(chat.id)}
                  className="p-1"
                >
                  <Trash2 className="h-5 w-5 text-red-400 hover:text-red-600" />
                </div>
                {openDeleteId === chat.id && (
                  <FloatingPortal>
                    <div
                      ref={refs.setFloating}
                      style={floatingStyles}
                      {...getFloatingProps()}
                      className="bg-white p-2 rounded shadow-lg z-10"
                    >
                      <button
                        onClick={() => handleDeleteChat(chat.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete Chat
                      </button>
                    </div>
                  </FloatingPortal>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-4 text-slate-200">No chats available</div>
        )}
      </div>
    </div>
  );
};