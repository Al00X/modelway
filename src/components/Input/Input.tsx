import Icon from '@/components/Icon/Icon';
import {forwardRef, KeyboardEvent, useEffect, useImperativeHandle, useRef, useState} from 'react';

export type InputElementType = {
  focus: () => void;
  getBoundingClientRect: () => DOMRect,
  blur: () => void;
  clear: () => void;
};

const Input = forwardRef<
  InputElementType,
  {
    placeholder?: string;
    icon?: string;
    value?: string;
    onValue?: (e: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    clearable?: boolean;
    debounce?: number;
    className?: string;
    readonly?: boolean;
    setCursorToEnd?: boolean;
    startEl?: any;
  }
>((props, ref) => {
  const [input, setInput] = useState(props.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    // lazy-ass fix for a bug where u need to update the input when value changes...
    if (!props.debounce) {
      setInput(props.value);
    }
  }, [props.value]);

  function onInputChange(e: string) {
    setInput(e);

    const changeFn = () => (props.onValue ? props.onValue(e) : null);
    if (props.debounce) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        changeFn();
      }, props.debounce);
    } else {
      changeFn();
    }
  }

  function clearInput() {
    setInput('');
    props.onValue ? props.onValue('') : null;
  }

  function focus() {
    inputRef.current?.focus();
  }

  function blur() {
    inputRef.current?.blur();
  }

  useImperativeHandle(
    ref,
    () => ({
      getBoundingClientRect: () => wrapperRef.current!.getBoundingClientRect(),
      focus,
      blur,
      clear: clearInput
    }),
    [wrapperRef.current],
  );

  return (
    <div
      ref={wrapperRef}
      onClick={() => {
        focus();
        props.onClick?.();
      }}
      style={{ cursor: 'text' }}
      className={`w-full min-h-[2.75rem] h-auto flex items-center bg-gray-600 border border-gray-400 text-white rounded-lg gap-4 p-2 overflow-auto ${
        props.className ?? ''
      }`}
    >
      {props.icon && (
        <Icon className={`flex-none ml-2 opacity-60 pointer-events-none`} icon={props.icon} size={`1rem`} />
      )}
      {props.startEl}
      <input
        ref={inputRef}
        className={`bg-transparent w-full outline-0`}
        style={{ cursor: 'inherit', minWidth: '3rem' }}
        value={input}
        onInput={(e) => onInputChange(e.currentTarget.value)}
        onMouseDown={(e) => {
          if (props.setCursorToEnd) {
            e.preventDefault();
            if (inputRef.current !== document.activeElement) {
              inputRef.current?.focus();
            }
          }
        }}
        onFocus={() => props.onFocus?.()}
        onBlur={() => props.onBlur?.()}
        onKeyDown={props.onKeyDown}
        placeholder={props.placeholder}
        readOnly={props.readonly}
      />
      {props.clearable && (
        <div className={`w-6 flex-none`}>
          <Icon
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              clearInput();
            }}
            className={`transition-all cursor-pointer ${input ? 'w-6' : 'w-0'}`}
            icon={'close'}
          />
        </div>
      )}
    </div>
  );
});

export default Input;
