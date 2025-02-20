import Link from 'next/link';
import React from 'react';
import { Title } from '../title';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';


interface Props {
  id: number;
  name: string;
  imageUrl?: string;
  className?: string;
}

export const ItemCard: React.FC<Props> = ({
  id,
  name,
  imageUrl,
  className,
}) => {
  return (
    <div className={cn("group mx-2 relative ", className)}>
    <Link href={`/product/${id}`}>
      {/* ✅ Убрали фиксированную ширину, теперь блоки адаптивны */}
      <div className="w-full bg-secondary rounded-lg group-hover:z-10 group-hover:absolute">
        <div className="block">
          <img
            className="w-full h-auto rounded-t-lg pb-4 overflow-hidden"
            src={imageUrl ? imageUrl : ""}
            alt=""
          />
        </div>
        {/* ✅ Hover-текст теперь тоже адаптивен */}
        <Title
          text={name}
          size="sm"
          className="pb-2 px-3 font-sans h-[40px] overflow-hidden text-ellipsis group-hover:h-auto group-hover:min-h-14 group-hover:text-clip group-hover:break-all "
        />
      </div>
    </Link>
  </div>
  );
};
