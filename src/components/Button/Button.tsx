export default function Button(props: { onClick?: () => void; children?: any; className?: string }) {
  return (
    <button
      type="button"
      className={`inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 focus:outline-none ${
        props.className ?? ''
      }`}
      onClick={() => (props.onClick ? props.onClick() : null)}
    >
      {props.children}
    </button>
  );
}
