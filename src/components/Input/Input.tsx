import Icon from '@/components/Icon/Icon';
import {forwardRef, useEffect, useRef, useState} from 'react';

const Input = forwardRef<HTMLInputElement, {
  placeholder?: string;
  icon?: string;
  value?: string;
  onValue?: (e: string) => void;
  clearable?: boolean;
  debounce?: number;
  className?: string;
  readonly?: boolean;
}>((props, ref) => {
  const [input, setInput] = useState(props.value);
  const timeoutRef = useRef<any>(null);

  // useEffect(() => {
  //   setInput(props.value);
  // }, [props.value])

  function onInputChange(e: string) {
    setInput(e);

    const changeFn = () => (props.onValue ? props.onValue(e) : null);
    if (props.debounce) {
      clearTimeout(timeoutRef.current);
      setTimeout(() => {
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
        style={{cursor: "text"}}
      className={`w-full h-full flex items-center bg-gray-600 border border-gray-400 text-white rounded-lg gap-4 p-2 ${props.className ?? ''}`}
    >
      {props.icon && <Icon className={`flex-none ml-2 opacity-60`} icon={props.icon} size={`1rem`} />}
      <input
        ref={ref}
        className={`bg-transparent w-full outline-0`}
        style={{cursor: "inherit"}}
        value={input}
        onInput={(e) => onInputChange(e.currentTarget.value)}
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
