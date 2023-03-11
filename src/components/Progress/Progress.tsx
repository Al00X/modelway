export default function Progress(props: {
  current: number;
  total: number;
  className?: string;
}) {
  return <div style={{width: '16rem', height: '3px'}} className={`${props.className ?? ''}`}>
    <div className={`w-full h-full bg-gray-900 relative`}>
      <div className={`absolute left-0 top-0 bottom-0 transition-all bg-white`} style={{width: `${(props.current / props.total) * 100}%`, transitionDuration: '50ms'}}></div>
    </div>
  </div>
}
