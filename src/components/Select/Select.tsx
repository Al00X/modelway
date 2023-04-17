import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Menu } from '@mantine/core';
import { GlobalHotKeys } from 'react-hotkeys';
import { KeyValue } from '@/interfaces/utils.interface';
import Input, { InputElementType } from '@/components/Input/Input';
import { arraysEqual } from '@/helpers/native.helper';

interface SelectChildrenProp<T> {
  selected: KeyValue<T> | undefined;
}

export type SelectElementType = {
  clear: () => void;
};

interface SelectProps<T> {
  className?: string;
  items: KeyValue<T>[];
  value?: T[] | null;
  onValue?: (e: T[] | null) => void;
  children?: (props: SelectChildrenProp<T>) => any;
  multiple?: boolean;
  cols?: number;
  icon?: string;
  placeholder?: string;
  clearable?: boolean;
  multi?: boolean;
}

const Select = forwardRef<SelectElementType, SelectProps<any>>(
  <T extends string>(props: SelectProps<T>, ref: ForwardedRef<SelectElementType>) => {
    const [selected, setSelected] = useState<KeyValue<T>[]>([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [list, setList] = useState(props.items);

    const inputRef = useRef<InputElementType>(null);

    useEffect(() => {
      // Goshadism is kicking hard, '!props.multi' should be removed and add support...? we dont need it so we dont support it :3
      if (props.value && !props.multi) {
        const items = props.items.filter((x) => props.value?.includes(x.value));

        setSelected(items);
      }
    }, [props.value]);

    useEffect(() => {
      if (!search || search === '') {
        setList(props.items);

        return;
      }
      setList(props.items.filter((x) => x.value.includes(search)));
    }, [search, props.items]);

    const isSelected = useCallback(
      (item: KeyValue<T>) => {
        return selected.some((x) => x.value === item.value);
      },
      [selected],
    );

    const emitValue = useCallback(
      (newList: typeof selected) => {
        setSelected(newList);
        if (!props.clearable && newList.length === 0) return;
        const newValues = newList.map((x) => x.value);

        if (arraysEqual(newValues, props.value ?? [])) return;
        props.onValue?.(newList.length > 0 ? newList.map((x) => x.value) : null);
      },
      [props.value, props.onValue, props.clearable],
    );

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

    function select(item: KeyValue<T>, clear = true) {
      if (!props.multi) {
        emitValue([item]);
        setMenu(false);
        inputRef.current?.blur();
      } else {
        if (selected.includes(item)) {
          emitValue(selected.filter((x) => x !== item));
        } else {
          emitValue([...selected, item]);
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

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          emitValue([]);
        },
      }),
      [emitValue],
    );

    return (
      <>
        <GlobalHotKeys
          keyMap={{ escape: 'esc' }}
          handlers={{
            escape: () => {
              setMenu(false);
            },
          }}
        />
        <Menu
          closeOnEscape
          width={'target'}
          opened={open}
          closeOnClickOutside={false}
          closeDelay={0}
          openDelay={0}
          position={`bottom-start`}
          offset={4}
          classNames={{
            dropdown: `max-h-60 overflow-auto rounded-lg bg-gray-800 text-base shadow-xl border-gray-550 p-0`,
          }}
        >
          <Menu.Target>
            <Input
              setCursorToEnd
              ref={inputRef}
              value={!props.multi ? (selected.length > 0 ? selected[0].label : '') : ''}
              placeholder={props.placeholder}
              readonly={false}
              icon={props.icon}
              className={props.className}
              clearable={false}
              startEl={
                <>
                  {!!props.multi && (
                    <div className={`flex`}>
                      {selected.map((x) => (
                        <span
                          key={x.value}
                          role={`button`}
                          tabIndex={-1}
                          className={`whitespace-nowrap cursor-pointer hover:bg-gray-700 px-1`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            select(x, false);
                          }}
                        >
                          {x.label},{' '}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              }
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
            />
          </Menu.Target>
          <Menu.Dropdown>
            {list.length === 0 && (
              <div className={`flex flex-col items-center`}>
                <p className={`mx-auto opacity-80 mt-3 text-center`}>No item is available</p>
                <p className={`text-xs text-center opacity-40 mt-1 mb-3`}>Sync or manually add data to your models</p>
              </div>
            )}
            {list.map((item, index, arr) => (
              <>
                <div
                  tabIndex={0}
                  role={`menuitem`}
                  className={`relative cursor-pointer select-none py-2 px-4 bg-gray-100 ${
                    isSelected(item) ? 'opacity-90 bg-opacity-20' : 'text-white bg-opacity-0 hover:bg-opacity-5'
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    select(item);
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
  },
);

export default Select;
