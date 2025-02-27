// src/components/shared/chat/chat-messages.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatStore } from '@/lib/chatStore';
import { useSession } from 'next-auth/react';
import { DeleteMessage } from '@/app/actions/chat';
import { useFloating, shift, offset, flip, autoUpdate, Placement } from '@floating-ui/react';
import Message from './message';

export const ChatMessages: React.FC = () => {
  const { chats, selectedChatId } = useChatStore();
  const { data: session } = useSession();
  const selectedChat = chats.find((c) => c.chat.id === selectedChatId)?.chat;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedMessage = selectedChat?.messages.find((msg) => msg.id === selectedMessageId);
  const placement: Placement =
    selectedMessage?.sender.fullName === session?.user?.fullName ? 'bottom-end' : 'bottom-start';

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [offset(5), flip(), shift()],
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  // Скролл вниз при загрузке или изменении сообщений
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && selectedChat?.messages.length) {
      console.log('Scroll to bottom', scrollContainer.scrollHeight);
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [selectedChat?.messages, selectedChatId]);

  const handleDeleteMessage = useCallback(
    async (messageId: number) => {
      if (session?.user?.id) {
        
        await DeleteMessage(messageId, session.user.id);
        setIsOpen(false);
        setSelectedMessageId(null);
      }
    },
    [session?.user?.id]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>, msgId: number) => {
    e.preventDefault();
    setSelectedMessageId(msgId);
    setIsOpen((prev) => !prev);
  }, []);

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 ">
      {selectedChat.messages.map((msg) => (
        <Message
          key={msg.id}
          msg={msg}
          isSelected={msg.id === selectedMessageId}
          setReference={refs.setReference}
          onContextMenu={handleContextMenu}
        />
      ))}
      {isOpen && selectedMessageId && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="bg-slate-200 border rounded shadow-lg p-2 z-10"
        >
          <button
            onClick={() => handleDeleteMessage(selectedMessageId)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100"
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}