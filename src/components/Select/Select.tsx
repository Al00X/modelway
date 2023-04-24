import {
  ForwardedRef,
  forwardRef,
  Fragment,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Menu } from '@mantine/core';
import { GlobalHotKeys } from 'react-hotkeys';
import { KeyValue } from '@/interfaces/utils.interface';
import Input, { InputElementType } from '@/components/Input/Input';
import { arrayHasAll, arraysEqual } from '@/helpers/native.helper';

interface SelectChildrenProp<T> {
  selected: KeyValue<T> | undefined;
}

export type SelectElementType = {
  clear: () => void;
  focus: () => void;
};

interface SelectProps<T> {
  autocomplete?: boolean;
  className?: string;
  items: KeyValue<T>[];
  value?: T[] | null;
  input?: string;
  onValue?: (e: T[] | null) => void;
  onInput?: (e: string) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  children?: (props: SelectChildrenProp<T>) => any;
  multiple?: boolean;
  cols?: number;
  icon?: string;
  placeholder?: string;
  clearable?: boolean;
  multi?: boolean;
  offset?: number;
}

const Select = forwardRef<SelectElementType, SelectProps<any>>(
  <T extends string>(props: SelectProps<T>, ref: ForwardedRef<SelectElementType>) => {
    const [selected, setSelected] = useState<KeyValue<T>[]>([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [list, setList] = useState(props.items);
    const [focused, setFocused] = useState(-1);

    const inputRef = useRef<InputElementType>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);

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
      setFocused(-1);
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
      setFocused(-1);
      if (props.autocomplete) {
        emitValue([item]);
        // setMenu(false);
        props.onInput?.('');
        // props.onInput?.(item.value);
      } else if (props.multi) {
        if (selected.includes(item)) {
          emitValue(selected.filter((x) => x !== item));
        } else {
          emitValue([...selected, item]);
        }
        if (clear) {
          inputRef.current?.clear();
        }
      } else {
        emitValue([item]);
        setMenu(false);
        inputRef.current?.blur();
      }
    }

    function autoSelect() {
      if (list.length > 0) {
        if (focused <= 0) {
          select(list[0]);
        } else {
          select(list[focused]);
        }
      }
    }

    useEffect(() => {
      if (props.autocomplete) {
        setSearch(props.input ?? '');
      }
    }, [props.input]);

    useEffect(() => {
      if (!listContainerRef.current) return;

      listContainerRef.current.scrollTo({
        top: (focused >= 0 ? focused : 0) * 41,
      });
    }, [focused]);

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          emitValue([]);
        },
        focus: () => {
          inputRef.current?.focus();
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
          offset={props.offset ?? 4}
          classNames={{
            dropdown:
              props.autocomplete && list.length === 0
                ? 'hidden'
                : `max-h-60 overflow-hidden rounded-lg bg-gray-800 text-base box-shadow border-gray-550 p-0`,
          }}
        >
          <Menu.Target>
            <Input
              setCursorToEnd
              ref={inputRef}
              placeholder={props.placeholder}
              readonly={!props.multi && !props.autocomplete}
              icon={props.icon}
              className={`${props.className ?? ''} cursor-pointer`}
              clearable={false}
              value={
                props.autocomplete ? props.input : !props.multi ? (selected.length > 0 ? selected[0].label : '') : ''
              }
              startEl={
                <>
                  {!!props.multi && (
                    <div className={`flex`}>
                      {selected.map((x) => (
                        <span
                          key={x.value}
                          role={`button`}
                          tabIndex={-1}
                          className={`whitespace-nowrap cursor-pointer hover:bg-gray-700 px-1 rounded-md`}
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
                if (props.autocomplete) {
                  setSearch(e);
                  props.onInput?.(e);
                } else if (props.multi) {
                  setSearch(e);
                }
              }}
              onKeyDown={(e) => {
                let emit = true;

                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenu(false);
                } else if (e.key === 'Enter' && open && list.length > 0) {
                  emit = false;
                  e.preventDefault();
                  e.stopPropagation();
                  autoSelect();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  let newFocus = focused + (e.key === 'ArrowDown' ? 1 : -1);

                  if (newFocus === -1) {
                    newFocus = 0;
                  } else if (newFocus === list.length || newFocus <= -2) {
                    newFocus = list.length - 1;
                  }
                  setFocused(newFocus);
                }
                if (emit) {
                  props.onKeyDown?.(e);
                }
              }}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <div ref={listContainerRef} className={`h-full max-h-60 overflow-auto`}>
              {list.length === 0 && !props.autocomplete && (
                <div className={`flex flex-col items-center`}>
                  <p className={`mx-auto opacity-80 mt-3 text-center`}>No item is available</p>
                  <p className={`text-xs text-center opacity-40 mt-1 mb-3`}>Sync or manually add data to your models</p>
                </div>
              )}
              {list.map((item, index, arr) => (
                <Fragment key={item.value}>
                  <div
                    tabIndex={0}
                    role={`menuitem`}
                    className={`relative cursor-pointer select-none py-2 px-4 bg-gray-100 ${
                      isSelected(item) && !props.autocomplete
                        ? 'opacity-90 bg-opacity-20'
                        : 'text-white bg-opacity-0 hover:bg-opacity-5'
                    } ${focused === index ? 'bg-opacity-10' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      select(item);
                    }}
                  >
                    <div className={`flex items-center`}>
                      {!props.autocomplete && (
                        <div className={`w-3 h-3 mr-4 relative`}>
                          {isSelected(item) && (
                            <div
                              className={`w-4 h-4 flex items-center justify-center border-2 border-white rounded-full`}
                            >
                              <div className={`w-2 h-2 flex items-center justify-center bg-white rounded-full`}></div>
                            </div>
                          )}
                        </div>
                      )}
                      <span
                        className={`text-base block truncate ${
                          props.autocomplete ? 'pl-1 font-normal' : isSelected(item) ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                  {arr.length !== index - 1 && (
                    <div className={`w-full border-b border-white border-opacity-10 pointer-events-none`}></div>
                  )}
                </Fragment>
              ))}
            </div>
          </Menu.Dropdown>
        </Menu>
      </>
    );
  },
);

Select.displayName = 'Select';
export default Select;
