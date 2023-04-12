import Icon from '@/components/Icon/Icon';
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

const Input = forwardRef<HTMLInputElement, {
  placeholder?: string;
  icon?: string;
  value?: string;
  onValue?: (e: string) => void;
  onFocus?: () => void;
  clearable?: boolean;
  debounce?: number;
  className?: string;
  readonly?: boolean;
}>((props, ref) => {
  const [input, setInput] = useState(props.value);
  const hostRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<any>(null);

  useImperativeHandle(ref, () => hostRef.current as any);

  useEffect(() => {
    // lazy-ass fix for a bug where u need to update the input when value changes...
    if (!props.debounce) {
      setInput(props.value);
    }
  }, [props.value])

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

  return (
    <div
      onClick={() => hostRef.current?.focus()}
        style={{cursor: "text"}}
      className={`w-full min-h-[2.75rem] h-auto flex items-center bg-gray-600 border border-gray-400 text-white rounded-lg gap-4 p-2 ${props.className ?? ''}`}
    >
      {props.icon && <Icon className={`flex-none ml-2 opacity-60 pointer-events-none`} icon={props.icon} size={`1rem`} />}
      <input
        ref={hostRef}
        className={`bg-transparent w-full outline-0`}
        style={{cursor: "inherit"}}
        value={input}
        onInput={(e) => onInputChange(e.currentTarget.value)}
        onFocus={() => props.onFocus?.()}
        placeholder={props.placeholder}
        readOnly={props.readonly}
      />
      {props.clearable && (
        <div className={`w-6 flex-none`}>
          <Icon
            onCLick={() => clearInput()}
            className={`transition-all cursor-pointer ${input ? 'w-6' : 'w-0'}`}
            icon={'close'}
          />
        </div>
      )}
    </div>
  );
})

export default Input;
