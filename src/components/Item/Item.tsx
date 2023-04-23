import React from 'react';

export const Item = (props: {
  label?: string;
  children?: any;
  className?: string;
  startEl?: any;
  labelClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <div
      role={`presentation`}
      className={`flex items-center gap-3 relative ${props.className ?? ''}`}
      onClick={props.onClick}
    >
      {props.startEl}
      {!!props.label && <p className={`opacity-80 flex-none ${props.labelClassName ?? ''}`}>{props.label} :</p>}
      {props.children}
    </div>
  );
};
