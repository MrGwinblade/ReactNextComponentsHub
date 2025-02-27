'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useStore from '@/lib/useStore';
import { cn } from '@/shared/lib/utils';

interface ChatListProps {
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
  className?: string
}

export const ChatList: React.FC<ChatListProps> = ({ selectedChat, onSelectChat, className }) => {
  const { data: session } = useSession();
  const { chats, setChats } = useStore();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (!res.ok) throw new Error('Failed to fetch chats');
      const data = await res.json();
      console.log('Fetched chats:', data);
      if (Array.isArray(data)) {
        setChats(data);
      } else {
        console.error('Chats data is not an array:', data);
        setChats([]);
      }
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
      chat.participants.some(
        (p) => p.userId === userId && chat.type === 'DIRECT'
      )
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

  useEffect(() => {
    if (session?.user?.id) {
      fetchChats();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    searchUsers();
  }, [search]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className={cn("",className)}>
      <div className="p-4 border-b border-zinc-600">
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
      <div className="flex-1 overflow-y-auto text-slate-200">
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 hover:bg-slate-700/40 cursor-pointer flex items-center ${
                selectedChat === chat.id ? 'bg-[#151e29]' : ''
              }`}
            >
              <p className="font-medium">
                {chat.name ||
                  chat.participants.find((p) => p.userId !== session.user.id)
                    ?.user.fullName ||
                  'Unknown User'}
              </p>
            </div>
          ))
        ) : (
          <div className="p-4 text-slate-200">No chats available</div>
        )}
      </div>
    </div>
  );
}