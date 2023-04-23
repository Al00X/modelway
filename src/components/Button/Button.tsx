import './Button.scss';
import { forwardRef, MouseEvent, useEffect, useState } from 'react';
import { Loader } from '@/components/Loader/Loader';

export interface ButtonClickEvent {
  setLoading: (v: boolean) => void;
}

export const Button = forwardRef<
  HTMLButtonElement,
  {
    onClick?: (e: ButtonClickEvent) => void;
    children?: any;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    title?: string;
  }
>((props, ref) => {
  const [loading, setLoading] = useState(props.loading);

  function onClick(e: MouseEvent) {
    if (loading || props.disabled) return;
    props.onClick?.({ setLoading });
  }

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  return (
    <button
      ref={ref}
      title={props.title}
      type="button"
      style={{ fontSize: '0.875rem' }}
      className={`ui-button ${!loading && !props.disabled ? 'hover:bg-gray-150' : 'pointer-events-none'} ${
        props.disabled ? 'opacity-50' : ''
      } ${props.className ?? ''}`}
      onClick={(e) => {
        onClick(e as never);
      }}
    >
      <div className={`flex items-center justify-center ${loading ? 'opacity-0 pointer-events-none' : ''}`}>
        {props.children}
      </div>
      {!!loading && (
        <div className={`absolute inset-2 flex items-center justify-center`}>
          <Loader />
        </div>
      )}
    </button>
  );
});
