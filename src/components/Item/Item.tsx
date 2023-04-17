export const Item = (props: {
  label?: string;
  children?: any;
  className?: string;
  startEl?: any;
  labelClassName?: string;
}) => {
  return (
    <div className={`flex items-center gap-3 relative ${props.className ?? ''}`}>
      {props.startEl}
      {!!props.label && <p className={`opacity-80 flex-none ${props.labelClassName ?? ''}`}>{props.label} :</p>}
      {props.children}
    </div>
  );
};
