import React, { useEffect, useState } from 'react';
import { KeyValue } from '@/interfaces/utils.interface';
import Input from '@/components/Input/Input';
import { Menu } from '@mantine/core';

interface SelectChildrenProp<T> {
  selected: KeyValue<T> | undefined;
}

export default function Select<T extends string>(props: {
  className?: string;
  items: KeyValue<T>[];
  value?: T;
  onValue?: (e: T | undefined) => void;
  children?: (props: SelectChildrenProp<T>) => any;
  multiple?: boolean;
  cols?: number;
  icon?: string;
  placeholder?: string;
  clearable?: boolean;
}) {
  const [selected, setSelected] = useState(props.value ? props.items.find((x) => props.value === x.value) : undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.onValue?.(selected?.value);
  }, [selected]);

  function isSelected(item: KeyValue<T>) {
    return selected?.value === item.value;
  }

  function select(item: KeyValue<T>) {
    setSelected(item);
    setOpen(false);
  }

  return (
    <Menu
      width={`target`}
      opened={open}
      onClose={() => setOpen(false)}
      classNames={{
        dropdown: `max-h-60 overflow-auto rounded-lg bg-gray-800 text-base shadow-xl border-gray-550 p-0 mt-1`,
      }}
      closeOnClickOutside={true}
      closeOnEscape={true}
      closeDelay={0}
      openDelay={0}
    >
      <Menu.Target>
        <Input
          value={selected?.label ?? ''}
          placeholder={props.placeholder}
          readonly={true}
          icon={props.icon}
          className={props.className}
          onFocus={() => {
            setOpen(true);
          }}
          clearable={props.clearable}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {props.items.map((item, index, arr) => (
          <>
            <div
              className={`relative cursor-pointer select-none py-2 px-4 bg-gray-100 ${
                isSelected(item)
                  ? 'opacity-90 bg-opacity-20'
                  : 'text-white bg-opacity-0 hover:bg-opacity-5'
              }`}
              onClick={() => select(item)}
            >
              <div className={`flex items-center`}>
                <div className={`w-3 h-3 mr-4 relative`}>
                  {isSelected(item) && (
                    <div className={`w-4 h-4 flex items-center justify-center border-2 border-white rounded-full`}>
                      <div className={`w-2 h-2 flex items-center justify-center bg-white rounded-full`}></div>
                    </div>
                  )}
                </div>
                <span className={`text-base block truncate ${isSelected(item) ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
              </div>
            </div>
            {arr.length !== index - 1 && (
              <div className={`w-full border-b border-white border-opacity-10 pointer-events-none`}></div>
            )}
          </>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
