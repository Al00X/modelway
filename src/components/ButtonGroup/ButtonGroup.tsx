import { useState } from 'react';
import Icon from '@/components/Icon/Icon';

export default function ButtonGroup(props: {
  items: { text: string; value: string; icon?: string }[];
  value?: string;
  onValue?: (e: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex ${props.className ?? ''} rounded-lg overflow-hidden gap-0.5`}>
      {props.items.map((x) => (
        <div
          key={x.value}
          className={`transition-all filter hover:brightness-110 cursor-pointer flex items-center justify-center px-2 py-1 text-white ${
            props.value === x.value ? 'pointer-events-none bg-gray-550' : 'bg-gray-300'
          }`}
          onClick={() => (props.onValue ? props.onValue(x.value) : null)}
        >
          {x.icon && <Icon icon={x.icon} />}
          {x.text}
        </div>
      ))}
    </div>
  );
}
