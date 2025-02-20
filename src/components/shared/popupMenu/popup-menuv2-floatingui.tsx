"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/shared/lib/utils";
import { useFloating, shift, offset, flip, autoUpdate } from "@floating-ui/react";



{/* 
  📌 useFloating:
  Это хук из @floating-ui/react, который автоматически рассчитывает позицию всплывающего элемента (например, меню).
  Он возвращает ссылки (refs) для привязки к элементам и стили (floatingStyles) для корректного позиционирования.

  🔹 shift:
  - Этот middleware предотвращает выход всплывающего элемента за границы контейнера или экрана.
  - Если меню упирается в край экрана, shift его сдвигает так, чтобы оно оставалось видимым.

  🔹 offset:
  - Определяет расстояние между кнопкой и всплывающим меню.
  - В данном случае offset(5) добавляет 5px отступа от кнопки.

  🔹 flip:
  - Если меню не помещается снизу, оно автоматически перевернется вверх.
  - Например, если кнопка близко к нижнему краю экрана, flip поднимет меню над ней.

  🔹 autoUpdate:
  - Следит за изменениями позиции кнопки, размерами окна и скроллом.
  - Автоматически обновляет положение всплывающего элемента, если что-то изменилось.
*/} 


interface Props {
  className?: string;
}

export const PopupMenuv2: React.FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  // useFloating автоматически рассчитывает позицию меню
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start", // Меню появится под кнопкой (слева)
    middleware: [offset(5), flip(), shift()], // Добавляем смещение и автоматическую подстройку
    whileElementsMounted: autoUpdate, 
  });

  return (
    <div className={cn("flex flex-col justify-center items-center p-10 gap-10" , className)}>
    <Button ref={refs.setReference} onClick={() => isOpen? setIsOpen(false) : setIsOpen(true)}>
        Button
    </Button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="absolute bg-white shadow-lg border rounded-md p-2 w-40"
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