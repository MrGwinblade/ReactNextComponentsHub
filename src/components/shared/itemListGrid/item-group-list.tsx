'use client';

import React from 'react';
import { useIntersection } from 'react-use';

import { Title } from '../title';
import { cn } from '@/shared/lib/utils';
import { ItemCard } from './item-card';


interface Props {
  title: string;
  items: any[];
  categoryId?: number;
  className?: string;
  listClassName?: string;
}


export const ItemsGroupList: React.FC<Props> = ({
  title,
  items,
  listClassName,
  categoryId,
  className,
}) => {
  
  const intersectionRef = React.useRef<HTMLDivElement | null>(null);
const intersection = useIntersection(intersectionRef as React.RefObject<HTMLDivElement>, {
  threshold: 0.4,
});


  {React.useEffect(() => {
    if (intersection?.isIntersecting) {
      console.log(title);
      console.log(categoryId);
      //setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, title]);}

  return (
<div
  className={cn("", className)}
  id={title}
  ref={intersectionRef as React.RefObject<HTMLDivElement>}
>
  <Title text={title} size="lg" className="font-extrabold mb-5" />

  {/* ✅ 4 колонки на больших экранах, 2 на средних, 1 на маленьких */}
  <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2", listClassName)}>
    {items.map((item) => (
      <ItemCard key={item.id} id={item.id} name={item.name} imageUrl={item.imageUrl} />
    ))}
  </div>
</div>
  );
};