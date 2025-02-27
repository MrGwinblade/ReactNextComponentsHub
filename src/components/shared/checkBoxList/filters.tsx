'use client';

import React from 'react';
import { Title } from '../title';
import { Input } from '../../ui';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilters } from './use-filters';
import { cn } from '@/lib/utils';


//Левый блок с фильтрами и слайдером, общий контейнер

interface Props {
  className?: string;
}

const items = [
    { text: 'CheckBox1', value: '0' },
    { text: 'CheckBox2', value: '1' },
    { text: 'CheckBox3', value: '2' },
    { text: 'CheckBox4', value: '3' },
    { text: 'CheckBox5', value: '4' },
    { text: 'CheckBox6', value: '5' }
]


export const Filters: React.FC<Props> = ({ className }) => {

const filters = useFilters();

React.useEffect(() => {
  console.log([Array.from(filters.checkBoxItems)
  ])
  console.log()
});

  return (
    <div className={cn("",className)}>
      <Title text="ЧекБоксы" size="sm" className="mb-2 font-bold" />
      
      <button 
      onClick={filters.clearCheckBoxItems} 
      className="text-zinc-900 my-2 text-base hover:underline font-bold focus:outline-none">
      Сбросить фильтры
    </button>

      {/* checkbox */}

      <CheckboxFiltersGroup
        title="Title"
        name="CheckBoxTypes"
        className="mb-5"
        onClickCheckbox={filters.toggleCheckBoxItem}
        selected={filters.checkBoxItems}
        limit={4} 
        defaultItems={items.slice(0,2)}
        items={items}
      />

    </div>
  );
};
