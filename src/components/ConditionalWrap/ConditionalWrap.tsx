export default function ConditionalWrap(props: {
  condition: boolean;
  wrap: (children: any) => any;
  children: any;
}) {
  return props.condition ? props.wrap(props.children) : props.children;
}
