import "./Tag.scss";
import {useRef} from "react";

export default function Tag(props: { tag: string, onClick?: () => void, onRightClick?: () => void, onDoubleClick?: () => void; }) {
  const clickTimeout = useRef<any>(null);

  function onClick() {
    props.onClick ? props.onClick() : null;
  }
  function onRightClick() {
      props.onRightClick ? props.onRightClick() : null;
  }
  function onDoubleClick() {
    props.onDoubleClick ? props.onDoubleClick() : null;
  }

  function onHandleClick(e: MouseEvent) {
    clearTimeout(clickTimeout.current);

    if (e.detail === 1) {
      clickTimeout.current = setTimeout(() => onClick(), 300)
    } else if (e.detail === 2) {
      onDoubleClick()
    }
  }

  return (
    <div
      className={`tag`}
      key={props.tag}
      onClick={(e) => onHandleClick(e as any)}
      onContextMenu={() => onRightClick()}
    >
      {props.tag}
    </div>
  );
}
