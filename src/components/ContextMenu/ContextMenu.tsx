import {
  Menu,
  useContextMenu
} from "react-contexify";

export default function ContextMenu(props: {
  id: string,
  children?: any,
}) {
  const { show } = useContextMenu({
    id: props.id,
  });

  return (
    <div className={`contents`} onContextMenu={(e) => show({event: e})}>
      {props.children}
    </div>
  );
}
