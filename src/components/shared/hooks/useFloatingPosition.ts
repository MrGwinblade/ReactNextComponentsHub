import { useState, useEffect, useRef } from "react";

interface Position {
  top: number;
  left: number;
}

export function useFloatingPosition(triggerRef: React.RefObject<HTMLElement>, isOpen: boolean, offset = 0) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + offset, // Под кнопкой с отступом
        left: rect.left + window.scrollX, // Левый край кнопки
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResizeOrScroll = () => {
      if (isOpen) updatePosition();
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [isOpen]);

  // Отслеживание изменения размеров кнопки
  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (isOpen) updatePosition();
    });

    observer.observe(triggerRef.current);

    return () => observer.disconnect();
  }, [isOpen]);

  return position;
}
