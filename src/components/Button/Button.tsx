import { MouseEvent, useEffect, useState } from 'react';
import { Loader } from '@/components/Loader/Loader';

export interface ButtonClickEvent {
  setLoading: (v: boolean) => void;
}

export const Button = (props: {
  onClick?: (e: ButtonClickEvent) => void;
  children?: any;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}) => {
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
      type="button"
      style={{ fontSize: '0.875rem' }}
      className={`transition-all duration-100 inline-flex justify-center items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 font-medium text-white ${
        !loading && !props.disabled ? 'hover:bg-gray-150' : 'pointer-events-none'
      } ${props.disabled ? 'opacity-50' : ''} focus:outline-none relative ${props.className ?? ''}`}
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
};
