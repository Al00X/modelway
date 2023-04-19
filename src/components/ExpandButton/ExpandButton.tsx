import { useHover } from '@mantine/hooks';
import { Icon } from '@/components/Icon/Icon';

export const ExpandButton = (props: {
  icon: string;
  iconSize?: string;
  expandWidth: string;
  children?: any;
  className?: string;
  onClick?: () => void;
}) => {
  const { hovered, ref } = useHover();

  return (
    <div
      tabIndex={-1}
      role={`button`}
      ref={ref}
      className={`flex items-center ${props.className ?? ''}`}
      onClick={props.onClick}
    >
      <Icon icon={props.icon} size={props.iconSize} />
      <div
        className={`flex overflow-hidden transition-all ml-1`}
        style={{ width: hovered ? props.expandWidth : '0px' }}
      >
        {props.children}
      </div>
    </div>
  );
};
