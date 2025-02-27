// src/components/shared/chat/chat-input.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useChatStore } from '@/lib/chatStore';
import { sendMessage } from '@/services/chatService';

interface Props {
  className?: string;
}

export const ChatInput: React.FC<Props> = (className)=>{
  const { selectedChatId } = useChatStore();
  const { data: session } = useSession();
  const [content, setContent] = useState('');

  const handleSend = async () => {
    if (!content || !selectedChatId || !session?.user?.id) return;
    await sendMessage(selectedChatId, session.user.id, content);
    setContent('');
  };

  if (!selectedChatId) return null;

  return (
    <div className={`p-4 border-t bg-[#223041] ${className}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}