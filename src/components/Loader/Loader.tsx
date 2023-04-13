import {Loader as LoaderMantine} from "@mantine/core";

export default function Loader(props: {
  className?: string;
}) {
    return <LoaderMantine className={`h-full loader stroke-white ${props.className ?? ''}`} variant={`oval`} />
}
