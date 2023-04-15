import React, {ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { KeyValue } from '@/interfaces/utils.interface';
import Input, { InputElementType } from '@/components/Input/Input';
import { Menu } from '@mantine/core';
import { GlobalHotKeys } from 'react-hotkeys';

interface SelectChildrenProp<T> {
  selected: KeyValue<T> | undefined;
}

export type SelectElementType = {
  clear: () => void;
}

interface SelectProps<T> {
  className?: string;
  items: KeyValue<T>[];
  value?: T;
  onValue?: (e: T[] | null) => void;
  children?: (props: SelectChildrenProp<T>) => any;
  multiple?: boolean;
  cols?: number;
  icon?: string;
  placeholder?: string;
  clearable?: boolean;
  multi?: boolean;
}

const Select = forwardRef<SelectElementType, SelectProps<any>>(<T extends string,>(props: SelectProps<T>, ref: ForwardedRef<SelectElementType>) => {
  const [selected, setSelected] = useState<KeyValue<T>[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [list, setList] = useState(props.items);

  const inputRef = useRef<InputElementType>(null);

  useEffect(() => {
    if (props.value) {
      const item = props.items.find((x) => props.value === x.value);
      if (item) {
        setSelected([item]);
      }
    }
  }, [])

  useEffect(() => {
    if (!props.clearable && selected.length === 0) return;
    props.onValue?.(selected.length > 0 ? selected.map(x => x.value) : null);
  }, [selected]);

  useEffect(() => {
    if (!search || search === '') {
      setList(props.items);
    }
    setList(props.items.filter(x => x.value.includes(search)));
  }, [search, props.items])

  function isSelected(item: KeyValue<T>): boolean {
    return !!selected.find(x => x.value === item.value)
  }

  function select(item: KeyValue<T>, clear = true) {
    if (!props.multi) {
      setSelected([item]);
      setMenu(false);
      inputRef.current?.blur();
    } else {
      if (selected.includes(item)) {
        setSelected(selected.filter(x => x !== item));
      } else {
        setSelected([...selected, item]);
      }
      if (clear) {
        inputRef.current?.clear();
      }
    }
  }

  function autoSelect() {
    if (list.length > 0) {
      select(list[0]);
    }
  }

  function setMenu(state: boolean) {
    setOpen(state);
    if (props.multi) {
      inputRef.current?.clear();
    }
    if (state) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSelected([]);
    }
  }), [])

  return (
    <>
      <GlobalHotKeys keyMap={{ ESCAPE: 'esc' }} handlers={{ ESCAPE: () => setMenu(false) }} />
      <Menu
        width={'target'}
        opened={open}
        classNames={{
          dropdown: `max-h-60 overflow-auto rounded-lg bg-gray-800 text-base shadow-xl border-gray-550 p-0`,
        }}
        closeOnClickOutside={false}
        closeOnEscape={true}
        closeDelay={0}
        openDelay={0}
        position={`bottom-start`}
        offset={4}
      >
        <Menu.Target>
          <Input
            ref={inputRef}
            value={!props.multi ? selected.length > 0 ? selected[0].label : '' : ''}
            placeholder={props.placeholder}
            readonly={false}
            icon={props.icon}
            className={props.className}
            onFocus={() => {
              setMenu(true);
            }}
            onBlur={() => {
              setMenu(false);
            }}
            onValue={(e) => {
              if (props.multi) {
                setSearch(e);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                autoSelect();
              }
            }}
            clearable={false}
            setCursorToEnd={true}
            startEl={<>
            { props.multi && <div className={`flex`}>{selected.map(x => <span onMouseDown={(e) => {
              e.preventDefault()
              select(x, false);
            }} className={`whitespace-nowrap cursor-pointer hover:bg-gray-700 px-1`}>{x.label}, </span>)}</div>}
            </>}
          />
        </Menu.Target>
        <Menu.Dropdown>
          {list.map((item, index, arr) => (
            <>
              <div
                className={`relative cursor-pointer select-none py-2 px-4 bg-gray-100 ${
                  isSelected(item) ? 'opacity-90 bg-opacity-20' : 'text-white bg-opacity-0 hover:bg-opacity-5'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  select(item)
                }}
              >
                <div className={`flex items-center`}>
                  <div className={`w-3 h-3 mr-4 relative`}>
                    {isSelected(item) && (
                      <div className={`w-4 h-4 flex items-center justify-center border-2 border-white rounded-full`}>
                        <div className={`w-2 h-2 flex items-center justify-center bg-white rounded-full`}></div>
                      </div>
                    )}
                  </div>
                  <span className={`text-base block truncate ${isSelected(item) ? 'font-medium' : 'font-normal'}`}>
                    {item.label}
                  </span>
                </div>
              </div>
              {arr.length !== index - 1 && (
                <div className={`w-full border-b border-white border-opacity-10 pointer-events-none`}></div>
              )}
            </>
          ))}
        </Menu.Dropdown>
      </Menu>
    </>
  );
})

export default Select;
