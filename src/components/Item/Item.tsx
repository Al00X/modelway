export default function Item(props: {
  label?: string;
  children?: any;
  className?: string;
}) {
  return <div className={`flex items-center gap-3 relative ${props.className ?? ''}`}>
    {props.label && <p className={`opacity-80 flex-none`}>{props.label} :</p>}
    {props.children}
  </div>
}
