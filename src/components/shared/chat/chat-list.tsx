// src/components/shared/chat/chat-list.tsx
import { useChatStore } from '@/lib/chatStore';
import { Session } from 'next-auth';
import { ChatSearch } from './chat-search';
import React from 'react';
import { Chat } from '@/@types/chat';
import { searchUsersOrChats } from './search-service';
import { ChatData } from '@/app/actions/chat';

interface ChatListProps {
  className?: string;
  session?: Session;
}

export const ChatList: React.FC<ChatListProps> = (className, session) => {
  const { chats, selectChat, selectedChatId } = useChatStore();

  const [searchValue, setSearchValue] = React.useState("");
  const [filteredChats, setFilteredChats] = React.useState<ChatData[]>([]);



  const onChangeSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;
    setSearchValue(value);

    const results = await searchUsersOrChats(value, chats.map((chatData) => chatData.chat));
    console.log(chats.map((chatData) => chatData.chat));
    setFilteredChats(results);
  };
  console.log(chats, " 123   ", filteredChats)

  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
       <div className="p-4">
        <div className="relative">
            <ChatSearch onChangeSearchInput={onChangeSearchInput}/>
        </div>
      </div>

      {chats.map((chatData) => {
        
        const  {chat}  = chatData;
        const lastMessage = chat.messages[chat.messages.length - 1]; // Исправляем выбор последнего сообщения
        return (
          <div
            key={chat.id}
            className={`p-4 cursor-pointer text-white hover:bg-[#263853] ${selectedChatId === chat.id ? 'bg-[#223041]' : ''}`}
            onClick={() => selectChat(chat.id)}
          >
            <div className="font-semibold">
              
              {chat.participants.find((p) => 
                  session?.user?.fullName !== undefined && // Проверяем, что fullName пользователя есть
                  p.fullName !== session.user.fullName // Находим участника, чей fullName не равен fullName текущего пользователя
                  )?.fullName ?? chat.participants[1]?.fullName
              }
              
            </div>
            {lastMessage && (
              <div className="text-sm text-gray-400 flex justify-between">
                <div>
                  <span>{lastMessage.sender.fullName}: </span>
                  <span>{lastMessage.content.slice(0, 50)}</span>
                </div>
                <span>{new Date(lastMessage.createdAt).toLocaleTimeString()}</span>
            </div>
            )}
          </div>
        );
      })}
    </div>
  );
}