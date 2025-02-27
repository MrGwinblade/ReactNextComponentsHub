'use client';

import { Input } from '@/components/ui';
import { cn } from '@/shared/lib/utils';
import { Search } from 'lucide-react';
import React from 'react';

interface Props {

  className?: string;

  onChangeSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ChatSearch: React.FC<Props> = ({ onChangeSearchInput, className }) => {
  return (
    <div className={cn(className)}>
        
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search messages..."  onChange={onChangeSearchInput}/>
      
    </div>
  );
};