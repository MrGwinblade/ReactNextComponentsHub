import { useSet } from 'react-use';
import React from 'react';

interface ReturnProps {
  /** Множество выбранных элементов чекбоксов */
  checkBoxItems: Set<string>;

  /** Функция для добавления/удаления элемента из множества */
  toggleCheckBoxItem: (value: string) => void;

  /** Очищает все выбранные элементы */
  clearCheckBoxItems: () => void;
}

/**
 * Хук для управления состоянием чекбокс-фильтров.
 * Позволяет добавлять, удалять и очищать выбранные элементы.
 */
export const useFilters = (): ReturnProps => {
  // Множество выбранных элементов (по умолчанию пустое)
  const [checkBoxItems, { toggle: toggleCheckBoxItem }] = useSet(new Set<string>());
  const [, forceUpdate] = React.useState({});


  // Функция для очистки множества
  const clearCheckBoxItems = () => {
    checkBoxItems.clear();
    forceUpdate({}); // Принудительно обновляем состояние
  };

  // Возвращаем мемоизированные значения, чтобы избежать лишних ререндеров
  return React.useMemo(
    () => ({
      checkBoxItems,
      toggleCheckBoxItem,
      clearCheckBoxItems,
    }),
    [checkBoxItems],
  );
};
