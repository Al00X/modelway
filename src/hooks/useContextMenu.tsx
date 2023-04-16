import { createRef, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { Menu } from '@mantine/core';

export interface ContextOptions<T> {
  items: { key: string; type?: 'button' | 'separator'; text: string | (() => string); action: () => void }[];
}

export const ContextMenuState$ = atom<(ContextOptions<any> & { posX: number; posY: number }) | undefined>(undefined);

export default function useContextMenu<T>(options: ContextOptions<T>) {
  const ref = createRef<any>();
  const [state, setState] = useAtom(ContextMenuState$);

  useEffect(() => {
    const el = ref.current as HTMLElement;
    const fn = (e: MouseEvent) => {
      setState({
        ...options,
        posX: e.clientX,
        posY: e.clientY,
      });
    };

    el.addEventListener('contextmenu', fn);

    return () => {
      el.removeEventListener('contextmenu', fn);
    };
  }, [options, ref, setState]);

  return [ref];
}

export const ContextMenuProvider = () => {
  const [state, setState] = useAtom(ContextMenuState$);

  function doAction(item: ContextOptions<any>['items'][number]) {
    item.action();
    setState(undefined);
  }

  return (
    <Menu
      opened={state !== undefined}
      position={`right-start`}
      onChange={() => {
        setState(undefined);
      }}
    >
      <Menu.Target>
        <div
          className={`fixed invisible`}
          style={{ left: `${state?.posX ?? 0}px`, top: `${state?.posY ?? 0}px` }}
        ></div>
      </Menu.Target>
      {state !== undefined && <div className={`absolute inset-0 z-[299]`}></div>}
      <Menu.Dropdown className={`p-0 min-w-[10rem]`}>
        {state?.items.map((item) => (
          <div
            tabIndex={-1}
            role={`menuitem`}
            key={item.key}
            className={`text-black ${
              item.type === 'button' || item.type === undefined ? 'px-4 py-3 hover:bg-gray-50 cursor-pointer' : ''
            }`}
            onClick={() => {
              doAction(item);
            }}
          >
            {typeof item.text === 'function' ? item.text() : item.text}
          </div>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
