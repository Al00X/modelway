import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Icon.scss';

export default function Icon(props: { icon: string; size?: string; className?: string, onCLick?: () => void; }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgData, setSvgData] = useState('');

  useEffect(() => {
    axios.get(`/icons/${props.icon}.svg`).then((res) => {
      setSvgData(res.data.replace('<svg', '<svg class="icon"'));
    });
  }, [props.icon]);

  useEffect(() => {
  }, [svgData]);

  return (
    <div
      style={{ width: props.size ?? '1.5rem', height: props.size ?? '1.5rem' }}
      className={`${props.className ?? ''}`}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svgData }}
      onClick={props.onCLick}
    ></div>
  );
}
