'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import  io, {Socket } from 'socket.io-client';
import useStore from '@/lib/useStore'; 

interface SocketMessage {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string | Date;
  sender: {
    fullName: string;
    avatarUrl: string | null;
  };
  status: string;
}

const socket = io('http://localhost:4000');

export default function ChatPage() {
  const { data: session } = useSession();
  const { chats, messages, setChats, addMessage, setMessages } = useStore();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

    socket.on('newMessage', handleNewMessage);
    fetchChats();

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [session?.user?.id]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (!res.ok) throw new Error('Failed to fetch chats');
      const data = await res.json();
      console.log('Fetched chats:', data); // Логирование для отладки
      // Убеждаемся, что data - массив
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
      setSelectedChat(existingChat.id);
      fetchMessages(existingChat.id);
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
        setSelectedChat(newChat.id);
        fetchMessages(newChat.id);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
    setSearch('');
    setSearchResults([]);
  };

  useEffect(() => {
    searchUsers();
  }, [search]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-1/3 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute bg-white border rounded mt-2 w-1/3 max-h-40 overflow-y-auto">
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
        <div className="flex-1 overflow-y-auto">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat.id);
                  fetchMessages(chat.id);
                }}
                className={`p-4 hover:bg-gray-100 cursor-pointer flex items-center ${
                  selectedChat === chat.id ? 'bg-gray-200' : ''
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
            <div className="p-4 text-gray-500">No chats available</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-lg font-semibold">
                {
                  chats.find((c) => c.id === selectedChat)?.participants.find(
                    (p) => p.userId !== session.user.id
                  )?.user.fullName || 'Chat'
                }
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages
                .filter((msg) => msg.chatId === selectedChat)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 ${
                      msg.senderId === session.user.id ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg max-w-md ${
                        msg.senderId === session.user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a chat or search for a user to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}