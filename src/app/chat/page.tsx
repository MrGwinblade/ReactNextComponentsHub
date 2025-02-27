// src/cat/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { fetchChats, initializeChatService } from '@/services/chatService';
import {ChatList} from '@/components/shared/chat/chat-list';
import {ChatHeader} from '@/components/shared/chat/chat-header';
import {ChatMessages} from '@/components/shared/chat/chat-messages';
import {ChatInput} from '@/components/shared/chat/chat-input';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id && status === 'authenticated') {
      console.log('Запуск fetchChats и initializeChatService для userId:', session.user.id);
      fetchChats(session, status);
      const cleanup = initializeChatService(session.user.id, session.user.fullName?? '');
      return cleanup;
    }
  }, [session, status]);

  if (status === 'loading') return <div>Загрузка...</div>;
  if (!session) return <div>Не авторизован</div>;

  return (
    <>
      <div className="h-screen grid grid-cols-[minmax(365px,_30%)_1fr] bg-[#0f1621] overflow-hidden">
        {/* Левая колонка (Список чатов) */}
        <div className="flex flex-col border-r bg-[#223041] min-w-[365px]">
          <div className="flex items-center gap-4 p-4 border-b h-[65px] flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={() => router.push('/?component=profileButton')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl text-slate-200 font-semibold">Messages</h1>
          </div>
          <ChatList className=" bg-[#223041] flex-1 overflow-y-auto" session={session} />
        </div>

        {/* Правая колонка (Чат) */}
        <div className="flex flex-col min-w-0 h-screen">
          <ChatHeader className="p-2 border-b bg-[#0f1621] h-[65px] flex-shrink-0" />
          <ChatMessages />
          <ChatInput className="p-4 border-t bg-[#223041] flex-shrink-0" />
        </div>
      </div>
      <Toaster />
    </>
  );
}