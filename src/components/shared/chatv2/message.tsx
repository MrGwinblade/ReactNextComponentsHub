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
  import { useState, useEffect } from 'react';

interface MessageItemProps {
    message: {
      id: number;
      chatId: number;
      senderId: number;
      content: string;
      createdAt: Date;
      sender: { fullName: string; avatarUrl: string | null };
    };
    userId: number;
    onDelete: (messageId: number) => void;
  }

export const MessageItem: React.FC<MessageItemProps> = ({ message, userId, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: 'bottom',
      middleware: [offset(5), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });
  
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);
  
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  
    return (
      <div className={`mb-2 flex ${message.senderId === userId ? 'justify-start' : 'justify-end'}`}>
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={`inline-block p-2 rounded-lg max-w-md cursor-pointer ${
            message.senderId === userId
              ? 'bg-white border text-slate-950'
              : 'bg-blue-500 text-slate-200'
          }`}
        >
          {message.content}
          {isOpen && (
            <FloatingPortal>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="bg-white p-2 rounded shadow-lg z-10 whitespace-nowrap"
              >
                <button
                  onClick={() => onDelete(message.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete Message
                </button>
              </div>
            </FloatingPortal>
          )}
        </div>
      </div>
    );
  };