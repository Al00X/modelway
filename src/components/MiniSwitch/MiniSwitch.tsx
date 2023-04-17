export const MiniSwitch = (props: {
  value?: boolean;
  onValue?: (e: boolean) => void;
  falseText?: string;
  trueText?: string;
  className?: string;
}) => {
  return (
    <div
      tabIndex={-1}
      role={`switch`}
      style={{ width: '52px', height: '28px' }}
      className={`transition-all relative p-0.5 border-white cursor-pointer outline-0 ${props.className ?? ''}`}
      onClick={() => {
        props.onValue?.(!props.value);
      }}
    >
      <div
        style={{ fontSize: '10px', letterSpacing: '1.45px' }}
        className={`transition-all w-full h-full flex items-center justify-center font-bold border ${
          props.value
            ? 'bg-white text-black hover:bg-opacity-80 border-transparent'
            : 'bg-white bg-opacity-0 hover:bg-opacity-10 text-white border-white'
        }`}
      >
        <span className={`text-center`}>{props.value ? props.trueText : props.falseText}</span>
      </div>
    </div>
  );
};
