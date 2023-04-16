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
}) => {
  const [loading, setLoading] = useState(props.loading);

  function onClick(e: MouseEvent) {
    if (loading) return;
    props.onClick?.({ setLoading });
  }

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  return (
    <button
      type="button"
      className={`inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-white ${
        !loading ? 'hover:bg-gray-100' : 'pointer-events-none'
      } focus:outline-none relative ${props.className ?? ''}`}
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
