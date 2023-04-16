import './Tag.scss';
import { useRef } from 'react';

export const Tag = (props: {
  tag: string;
  onClick?: () => void;
  onRightClick?: () => void;
  onDoubleClick?: () => void;
}) => {
  const clickTimeout = useRef<any>(null);

  function onHandleClick(e: MouseEvent) {
    clearTimeout(clickTimeout.current);

    if (e.detail === 1) {
      clickTimeout.current = setTimeout(() => {
        props.onClick?.();
      }, 300);
    } else if (e.detail === 2) {
      props.onDoubleClick?.();
    }
  }

  return (
    <div
      tabIndex={-1}
      role={`button`}
      className={`tag`}
      key={props.tag}
      onClick={(e) => {
        onHandleClick(e as any);
      }}
      onContextMenu={() => {
        props.onRightClick?.();
      }}
    >
      {props.tag}
    </div>
  );
};
