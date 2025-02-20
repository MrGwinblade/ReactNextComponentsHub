"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/shared/lib/utils";
import { useFloatingPosition } from "../hooks/useFloatingPosition";


//Банально берем позицию кнопки при клике используя buttonref, передаём координаты в хук, который динамично меняет позицию открывшегося меню.
//Лучше не использовать absolute у меню если у родителей есть relative, а то улетит по родителю, а не страницы.

interface Props {
  className?: string;
}

export const PopupMenu: React.FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const position = useFloatingPosition(buttonRef, isOpen);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn("", className)}>

      <p>Лучше используй v2, там @floating-ui, он прикольней.</p>

      <Button ref={buttonRef} onClick={toggleMenu}>
        Button
      </Button>

      {isOpen && (
        <div
          className="fixed bg-white shadow-lg border rounded-md p-2 w-40"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 900,
          }}
        >
          <ul className="space-y-2">
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Item 1</li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Item 2</li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Item 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};
