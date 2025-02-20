'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { useSession } from 'next-auth/react';

interface Props {
  className?: string;
}

export const CheckLogin: React.FC<Props> = ({ className }) => {

    //не забудь обернуть в <SessionProvider> 
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className={cn(className)}>Загрузка...</div>;
  }

  return (
    <div className={cn(className)}>
      {session ? (
        <div>
          <p>Вы авторизованы</p>
          <p>id: {session.user.id}</p>
          <p>Роль: {session.user.role}</p>
          <p>email: {session.user.email}</p>
          <p>ФИО: {session.user.fullName}</p>
          <p>Телефон: {session.user.phoneNumber}</p>

        </div>
      ) : (
        <p>Вы не авторизованы</p>
      )}
    </div>
  );
};