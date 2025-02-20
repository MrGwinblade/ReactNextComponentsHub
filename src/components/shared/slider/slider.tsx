'use client';

import React from 'react';
import { Title } from '../title';
import { Input } from '../../ui';
import { RangeSlider } from './range-slider';
import { useSliderFilters } from './use-slider';

//Левый блок с фильтрами и слайдером, общий контейнер

interface Props {
  className?: string;
}


export const Slider: React.FC<Props> = ({ className }) => {

const filters = useSliderFilters();

  const updatePrices = (prices: number[]) => {
    //console.log(prices, 999);
    filters.setSlider('sliderFrom', prices[0]);
    filters.setSlider('sliderTo', prices[1]);
  };
React.useEffect(() => {
// 

});

  return (
    <div className={className}>
      <Title text="Слайдер" size="sm" className="mb-4 font-bold" />
      
      <button 
      onClick={filters.clearFilters} 
      className="text-zinc-900 my-4 text-base hover:underline font-bold focus:outline-none">
      Сбросить значения
    </button>

        <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
            <p className="font-bold mb-3">Цена от и до:</p>
            <div className="flex gap-3 mb-5">
                <Input
                type="number"
                placeholder="0"
                min={0}
                max={1000}
                value={String(filters.sliderValues.sliderFrom)}
                onChange={(e) => filters.setSlider('sliderFrom', Number(e.target.value))}
                />
                <Input
                type="number"
                placeholder="30000"
                min={100}
                max={1000}
                value={String(filters.sliderValues.sliderTo)}
                onChange={(e) => filters.setSlider('sliderTo', Number(e.target.value))}
                />
            </div>
            <RangeSlider 
                min={0} 
                max={1000} 
                step={10} 
                value={[filters.sliderValues.sliderFrom || 0, filters.sliderValues.sliderTo|| 1000]}
                onValueChange={updatePrices}
                />
        </div>
    </div>
  );
};
