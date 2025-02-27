import { useChatStore } from '@/lib/chatStore';

interface Props {
  className?: string;
}

export const ChatHeader: React.FC<Props> = ({ className }) => {
  const { chats, selectedChatId } = useChatStore();
  const selectedChat = chats.find((c) => c.chat.id === selectedChatId)?.chat;

  

  return (
    (selectedChat && <div className={className}>
      <h2 className="text-lg font-semibold text-slate-200">
        {selectedChat.type === 'GROUP'
          ? selectedChat.name
          : selectedChat.participants.find((p) => p.id !== selectedChat.participants[0].id)?.fullName}
      </h2>
    </div>)
  );
}