import { useState } from 'react';
import Icon from '@/components/Icon/Icon';
import {KeyValue} from "@/interfaces/utils.interface";

export default function ButtonGroup(props: {
  items: KeyValue<string>[];
  value?: string;
  onValue?: (e: string) => void;
  className?: string;
  hideLabels?: boolean;
}) {
  return (
    <div className={`flex ${props.className ?? ''} rounded-lg overflow-hidden gap-0.5`}>
      {props.items.map((x) => (
        <div
          key={x.value}
          className={`transition-all filter flex items-center justify-center px-2 py-1 text-white gap-1 w-full border border-gray-400 ${
            props.value === x.value ? 'bg-gray-300 opacity-100' : 'bg-gray-500 opacity-60 hover:brightness-110 cursor-pointer'
          }`}
          onClick={() => (props.onValue && props.value !== x.value ? props.onValue(x.value) : null)}
          title={x.hint}
        >
          {x.icon && <Icon icon={x.icon} />}
          {!props.hideLabels ? x.label : ''}
        </div>
      ))}
    </div>
  );
}
