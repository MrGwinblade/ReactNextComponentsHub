'use client';

import { cn } from '@/shared/lib/utils';
import React, { useEffect, useState } from 'react';
import { object } from 'zod';

interface Props {

  className?: string;
}

  


export const Test: React.FC<Props> = ({ className }) => {

      

  return (
    <div className={cn(className)}>
      <div></div>
    </div>
  );
};