
// src/components/shared/chat/message.tsx
'use client';

import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ChatData } from '@/app/actions/chat';
import { memo } from 'react';

interface MessageProps {
  msg: ChatData['messages'][number];
  isSelected: boolean;
  setReference: (node: HTMLElement | null) => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, msgId: number) => void;
}

function Message({ msg, isSelected, setReference, onContextMenu }: MessageProps) {
  const { data: session } = useSession();
  const messageRef = useRef<HTMLDivElement>(null);

  const position = msg.sender.fullName === session?.user?.fullName ? 'right' : 'left';

  return (
    <div
      ref={isSelected ? setReference : null}
      className="mb-2 flex"
      onContextMenu={(e) => onContextMenu(e, msg.id)}
    >
      <div
        ref={messageRef}
        className={`max-w-xs p-2 rounded-lg cursor-pointer ${
          position === 'right' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 mr-auto'
        }`}
      >
        <div className="font-semibold">{msg.sender.fullName}</div>
        <div>{msg.content}</div>
        <div className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

export default memo(Message, (prevProps, nextProps) => {
  return (
    prevProps.msg.id === nextProps.msg.id &&
    prevProps.msg.content === nextProps.msg.content &&
    prevProps.msg.createdAt === nextProps.msg.createdAt &&
    prevProps.msg.sender.fullName === nextProps.msg.sender.fullName &&
    prevProps.msg.status === nextProps.msg.status &&
    prevProps.isSelected === nextProps.isSelected
  );
});
