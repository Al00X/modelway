import { MouseEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Icon.scss';
import { atom, useAtom } from 'jotai';

const svgCacheAtom = atom({} as { [p: string]: string });

export const Icon = (props: {
  icon: string;
  size?: string;
  className?: string;
  onMouseDown?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svgData, setSvgData] = useState('');
  const [atomCache, setAtomCache] = useAtom(svgCacheAtom);

  useEffect(() => {
    const cacheData = atomCache[props.icon];

    if (cacheData) {
      setSvgData(cacheData);
    } else {
      axios
        .get<string>(`/icons/${props.icon}.svg`)
        .then((res) => {
          const data = res.data.replace('<svg', '<svg class="icon"');

          setSvgData(data);
          // TODO: Caches like a bitch, race condition is destroying my ass... i cant take this anymore, i dont want caching, damn this
          setAtomCache({
            ...atomCache,
            [props.icon]: data,
          });
        })
        .catch((e) => {
          console.error('Icon fetch failed: ', props.icon, e);
        });
    }
  }, [props.icon]);

  return (
    <div
      role={'presentation'}
      style={{ width: props.size ?? '1.5rem', height: props.size ?? '1.5rem' }}
      className={`${props.className ?? ''}`}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svgData }}
      onMouseDown={(e) => props.onMouseDown?.(e as never)}
      onMouseUp={(e) => props.onClick?.(e as never)}
    ></div>
  );
};
