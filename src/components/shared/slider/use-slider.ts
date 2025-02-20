import { useSearchParams } from 'next/navigation';
import React from 'react';

interface SliderProps {
  sliderFrom?: number;
  sliderTo?: number;
}

export interface Filters {
  sliderFrom?: number;
  sliderTo?: number;
  sliderValues: SliderProps;
}

interface ReturnProps extends Filters {
  setSlider: (name: keyof SliderProps, value: number) => void;
  clearFilters: () => void;
}

export const useSliderFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as Map<string, string>;

  // Устанавливаем начальные значения для слайдера из query параметров
  const [sliderValues, setSlider] = React.useState<SliderProps>({
    //sliderFrom: Number(searchParams.get('sliderFrom')) || undefined,
    //sliderTo: Number(searchParams.get('sliderTo')) || undefined,
    sliderFrom: 0,
    sliderTo: 1000 
  });

  const updateSlider = (name: keyof SliderProps, value: number) => {
    setSlider((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSlider({ sliderFrom: 0, sliderTo: 1000 });
  };

  return React.useMemo(
    () => ({
      sliderFrom: sliderValues.sliderFrom,
      sliderTo: sliderValues.sliderTo,
      sliderValues, // Добавляем sliderValues
      setSlider: updateSlider,    // Используем нашу функцию setSlider
      clearFilters,
    }),
    [sliderValues] // Используем sliderValues для мемоизации
  );

};
