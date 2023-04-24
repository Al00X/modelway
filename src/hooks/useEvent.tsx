import { EventmitHandler, Eventmitter } from 'eventmit';
import { useEffect, useRef } from 'react';

export const useEvent = <T,>(e: Eventmitter<T>, action: EventmitHandler<T>) => {
  const handlerRef = useRef<EventmitHandler<T> | null>(null);

  useEffect(() => {
    if (handlerRef.current) {
      e.off(handlerRef.current);
    }

    e.on(action);
    handlerRef.current = action;

    return () => {
      if (handlerRef.current) {
        e.off(handlerRef.current);
      }
    };
  }, [e, action]);
};
