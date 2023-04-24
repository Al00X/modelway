import './MiniSwitch.scss';
import { Icon } from '@/components/Icon/Icon';

export const MiniSwitch = (props: {
  value?: boolean;
  onValue?: (e: boolean) => void;
  falseText?: string;
  trueText?: string;
  trueIcon?: string;
  falseIcon?: string;
  trueTitle?: string;
  falseTitle?: string;
  className?: string;
  activeClassName?: string;
}) => {
  return (
    <div
      tabIndex={-1}
      role={`switch`}
      style={{ fontSize: '10px', letterSpacing: '1.45px', width: '52px', height: '24px' }}
      title={props.value ? props.trueTitle : props.falseTitle}
      className={`ui-mini-switch ${props.value ? 'active' : ''} ${props.className ?? ''} ${
        props.value && props.activeClassName ? props.activeClassName : ''
      }`}
      onClick={() => {
        props.onValue?.(!props.value);
      }}
    >
      {!props.value && !!props.falseIcon && <Icon icon={props.falseIcon} className={`w-full h-full`} />}
      {!!props.value && !!props.trueIcon && <Icon icon={props.trueIcon} className={`w-full h-full`} />}
      {(!props.value && props.falseText) ||
        (props.value && props.trueText && (
          <span className={`text-center`}>{props.value ? props.trueText : props.falseText}</span>
        ))}
    </div>
  );
};
