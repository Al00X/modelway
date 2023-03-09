import { clipboard } from 'electron';
import { openToast } from '@/services/toast';
import "./Tag.scss";

export default function Tag(props: { tag: string, onClick?: () => void, onRightClick?: () => void }) {
  function onClick() {
    props.onClick ? props.onClick() : null;
  }
  function onRightClick() {
      props.onRightClick ? props.onRightClick() : null;
  }

  return (
    <div
      className={`tag`}
      key={props.tag}
      onClick={() => onClick()}
      onContextMenu={() => onRightClick()}
    >
      {props.tag}
    </div>
  );
}
