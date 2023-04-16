import { MouseEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Icon.scss';

export const Icon = (props: {
  icon: string;
  size?: string;
  className?: string;
  onMouseDown?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svgData, setSvgData] = useState('');

  useEffect(() => {
    axios
      .get<string>(`/icons/${props.icon}.svg`)
      .then((res) => {
        setSvgData(res.data.replace('<svg', '<svg class="icon"'));
      })
      .catch(() => {
        console.error('Icon fetch failed: ', props.icon);
      });
  }, [props.icon]);

  // useEffect(() => {
  // }, [svgData]);

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
