export const Separator = (props: { className?: string; vertical?: boolean }) => {
  return (
    <div
      style={{ margin: '1rem 0' }}
      className={`bg-gray-500 ${props.vertical ? 'w-px h-full' : 'h-px w-full'} ${props.className ?? ''}`}
    ></div>
  );
};
