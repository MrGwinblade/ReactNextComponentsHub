'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Toaster as Toaster2 } from "@/components/ui/sonner";
//import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { SessionProvider } from 'next-auth/react';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster2 />
      <Toaster />
      <NextTopLoader />
    </>
  );
};
